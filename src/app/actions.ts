"use server";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";

import { db } from "@/db";
import { Customers, Invoices, Status } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import Invoice from "./invoices/[invoiceId]/payment/page";
import { headers } from "next/headers";

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

export async function createAction(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    return;
  }
  const value = Math.floor(parseFloat(String(formData.get("value"))) * 100);
  // is tricky about data(value) because can be numbers with coma
  // for example 12.34 so we need multiply by 100
  // and at least we add Math.floor because we don't have to many numbers after coma for example 12.44545353

  const description = formData.get("description") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  const [customer] = await db
    .insert(Customers)
    .values({
      name,
      email,
      userId,
    })
    .returning({
      id: Customers.id,
    });

  const results = await db
    .insert(Invoices)
    .values({
      value,
      userId,
      description,
      customerId: customer.id,
      status: "open",
    })
    .returning({
      id: Invoices.id,
    });

  console.log("formData", formData);
  redirect(`/invoices/${results[0].id}`);
}

export async function updateStatusAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;
  const status = formData.get("status") as Status;
  if (!["open", "paid", "void", "uncollectible"].includes(status)) {
    console.error("Invalid status value:", status);
    return;
  }

  const results = await db
    .update(Invoices)
    .set({ status })
    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  revalidatePath(`/invoices/${id}`, "page");

  console.log(results);
}
export async function deleteInvoiceAction(formData: FormData) {
  const { userId } = await auth();

  if (!userId) {
    return;
  }

  const id = formData.get("id") as string;

  const results = await db
    .delete(Invoices)

    .where(and(eq(Invoices.id, parseInt(id)), eq(Invoices.userId, userId)));

  redirect(`/dashboard/`);
}

export async function createPayment(fromData: FormData) {
  const id = parseInt(fromData.get("id")) as string;
  const headersList = headers();
  const origin = (await headersList).get("origin");
  const [results] = await db
    .select({ status: Invoices.status, value: Invoices.value })
    .from(Invoices)
    .where(eq(Invoices.id, id))
    .limit(1);

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "eur",
          product: "prod_RLOWq2nVqAnDng",
          unit_amount: results.value,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/invoices/${id}/payment?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/invoices/${id}/payment?status=canceled&session_id={CHECKOUT_SESSION_ID}`,
  });
  if (!session.url) {
    throw new Error("Invalid session");
  }
  redirect(session.url);
}
