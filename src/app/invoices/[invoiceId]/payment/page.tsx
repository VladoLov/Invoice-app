import { Badge } from "@/components/ui/badge";

import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";

import Container from "@/components/Container";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, CreditCard } from "lucide-react";
import { createPayment, updateStatusAction } from "@/app/actions";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

interface SearchParams {
  session_id?: string; // Optional, as it may not always be present
  status?: string; // Optional, as it may not always be present
}
interface InvoicePageProps {
  params: { invoiceId: string };
  searchParams: SearchParams;
}

export default async function Invoice({
  params,
  searchParams,
}: InvoicePageProps) {
  const invoiceId = parseInt((await params).invoiceId);
  const sessionId = searchParams.session_id;
  const isSuccess = sessionId && searchParams.status === "success";
  const isCanceled = searchParams.status === "canceled";
  let isError = !sessionId;

  if (Number.isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }

  if (isSuccess) {
    const { payment_status } = await stripe.checkout.sessions.retrieve(
      sessionId
    );
    if (!payment_status) {
      isError = true;
    } else {
      const formData = new FormData();
      formData.append("id", String(invoiceId));
      formData.append("status", "paid");
      await updateStatusAction(formData);
    }
  }
  const [result] = await db
    .select({
      id: Invoices.id,
      status: Invoices.status,
      createTs: Invoices.createTs,
      description: Invoices.description,
      value: Invoices.value,
      name: Customers.name,
    })
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(eq(Invoices.id, invoiceId))
    .limit(1);

  /*   console.log(result); */
  //we got 2 objects invoices and customers

  if (!result) {
    notFound();
  }
  // when we have to objects in results  we need destructive this
  const invoice = {
    ...result,
    customer: {
      name: result.name,
    },
  };

  /* return <Invoice invoice={result} />; */
  // now we pass invoices instead results
  return (
    <main className="w-full  h-full ">
      <Container>
        {isError && (
          <p className="bg-red-600 text-white font-semibold text-center px-3 py-2 rounded-lg">
            Something went wrong, please try again!
          </p>
        )}
        {isCanceled && (
          <p className="bg-yellow-200 text-yellow-800 font-semibold text-center px-3 py-2 rounded-lg">
            Payment was canceled, please try again.
          </p>
        )}
        <div className="grid grid-cols-2">
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="text-5xl font-bold flex items-center gap-4">
                Invoices {invoice.id}
                <Badge
                  className={cn(
                    " rounded-full capitalize",
                    invoice.status === "open" && "bg-blue-500",
                    invoice.status === "paid" && "bg-green-500",
                    invoice.status === "void" && "bg-zinc-500",
                    invoice.status === "uncollectible" && "bg-red-500"
                  )}
                >
                  {invoice.status}
                </Badge>
              </h1>
            </div>
            <div>
              <p className="text-3xl mb-3">
                ${(invoice.value / 100).toFixed(2)}
              </p>

              <p className="text-lg mb-8">{invoice.description}</p>
            </div>
          </div>
          <div>
            <div>
              <h2 className="text-xl font-bold mb-4">Manage Invoice</h2>
              {invoice.status === "open" && (
                <form action={createPayment}>
                  <input type="hidden" name="id" value={invoice.id} />
                  <Button className="bg-green-600 hover:bg-green-500 font-semibold">
                    Pay Invoice
                    <CreditCard className="w-5 h-auto" />
                  </Button>
                </form>
              )}
              {invoice.status === "paid" && (
                <p className="text-xl font-bold  flex gap-4 flex-row items-center">
                  <Check className="w-8 h-auto bg-green-500 rounded-full text-white" />
                  Invoice Paid
                </p>
              )}
            </div>
          </div>
        </div>

        <h2 className="font-bold text-lg mb-4">Billing Details</h2>

        <ul className="grid gap-2">
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice ID
            </strong>
            <span>{invoice.id}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Invoice Date
            </strong>
            <span>{new Date(invoice.createTs).toLocaleDateString()}</span>
          </li>
          <li className="flex gap-4">
            <strong className="block w-28 flex-shrink-0 font-medium text-sm">
              Billing Name
            </strong>
            {/*  <span>{invoice.name}</span> */}
            {/** later we add name and email from second db called customers */}
            <span>{invoice.customer.name}</span>
          </li>
        </ul>
      </Container>
    </main>
  );
}
