import { notFound } from "next/navigation";

import { db } from "@/db";
import { Customers, Invoices } from "@/db/schema";

import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

import Invoice from "./Invoice";

export default async function InvoicePage({
  params,
}: {
  params: { invoiceId: string };
}) {
  const { userId } = await auth();
  if (!userId) return;
  const invoiceId = parseInt((await params).invoiceId);

  if (Number.isNaN(invoiceId)) {
    throw new Error("Invalid Invoice ID");
  }
  const [result] = await db
    .select()
    .from(Invoices)
    .innerJoin(Customers, eq(Invoices.customerId, Customers.id))
    .where(and(eq(Invoices.id, invoiceId), eq(Invoices.userId, userId)))
    .limit(1);

  /*   console.log(result); */
  //we got 2 objects invoices and customers

  if (!result) {
    notFound();
  }
  // when we have to objects in results  we need destructive this
  const invoices = {
    ...result.invoices,
    customer: result.customers,
  };
  console.log(invoices);

  /* return <Invoice invoice={result} />; */
  // now we pass invoices instead results
  return <Invoice invoice={invoices} />;
}

/* <main className="w-full  h-full ">
  <Container>
    <div className="flex justify-between mb-8">
      <h1 className="text-5xl font-bold flex items-center gap-4">
        Invoices {invoiceId}
        <Badge
          className={cn(
            " rounded-full capitalize",
            result.status === "open" && "bg-blue-500",
            result.status === "paid" && "bg-green-500",
            result.status === "void" && "bg-zinc-500",
            result.status === "uncollectible" && "bg-red-500"
          )}
        >
          {result.status}
        </Badge>
      </h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2" variant="outline">
            Change Status <ChevronDown className="w-4 h-auto" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {AVAILABLE_STATUSES.map((status) => {
            return (
              <DropdownMenuItem key={status.id}>
                <form action={updateStatusAction}>
                  <input type="hidden" name="id" value={invoiceId} />
                  <input type="hidden" name="status" value={status.id} />
                  <button type="submit">{status.label}</button>
                </form>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <div>
      <p className="text-3xl mb-3">${(result.value / 100).toFixed(2)}</p>

      <p className="text-lg mb-8">{result.description}</p>

      <h2 className="font-bold text-lg mb-4">Billing Details</h2>

      <ul className="grid gap-2">
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice ID
          </strong>
          <span>{result.id}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Invoice Date
          </strong>
          <span>{new Date(result.createTs).toLocaleDateString()}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Billing Name
          </strong>
          <span>{result.name}</span>
        </li>
        <li className="flex gap-4">
          <strong className="block w-28 flex-shrink-0 font-medium text-sm">
            Billing Email
          </strong>
          <span>{result.email}</span>
        </li>
      </ul>
    </div>
  </Container>
</main> */
