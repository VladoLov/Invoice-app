"use client";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Customers, Invoices } from "@/db/schema";
import { cn } from "@/lib/utils";

import {
  ChevronDown,
  CreditCard,
  Ellipsis,
  IdCard,
  Trash2,
} from "lucide-react";

import Container from "@/components/Container";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AVAILABLE_STATUSES } from "@/data/invoices";
import { updateStatusAction, deleteInvoiceAction } from "@/app/actions";
import { useOptimistic } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

interface InvoiceProp {
  invoice: typeof Invoices.$inferSelect;
}

export default function Invoice({
  invoice,
}: InvoiceProp & { customer: typeof Customers.$inferSelect }) {
  const [currentStatus, setCurrentStatus] = useOptimistic(
    invoice.status,
    (state, newStatus) => {
      return String(newStatus);
    }
  );
  async function handleUpdateStatus(formData: FormData) {
    const originalStatus = currentStatus;
    setCurrentStatus(formData.get("status"));
    try {
      await updateStatusAction(formData);
    } catch {
      setCurrentStatus(originalStatus);
    }
  }
  return (
    <main className="w-full  h-full ">
      <Container>
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
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex items-center gap-2" variant="outline">
                  Change Status
                  <ChevronDown className="w-4 h-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {AVAILABLE_STATUSES.map((status) => {
                  return (
                    <DropdownMenuItem className="w-full" key={status.id}>
                      {/*   <form action={updateStatusAction} className="w-full">  we use handleUpdateStatus when we add useOptimistic*/}
                      <form action={handleUpdateStatus} className="w-full">
                        <input type="hidden" name="id" value={invoice.id} />
                        <input type="hidden" name="status" value={status.id} />
                        <button type="submit" className="w-full text-start">
                          {status.label}
                        </button>
                      </form>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="flex items-center gap-2" variant="outline">
                    <span className="sr-only">More Options</span>{" "}
                    <Ellipsis className="w-4 h-auto" />
                    {/* <ChevronDown className="w-4 h-auto" /> */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <DialogTrigger asChild>
                      <button
                        type="submit"
                        className="w-full text-start text-red-500 flex gap-2 items-center"
                      >
                        <Trash2 className="w-4 h-auto" />
                        Delete Invoice
                      </button>
                    </DialogTrigger>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/invoices/${invoice.id}/payment`}
                      className="w-full text-start  flex gap-2 items-center"
                    >
                      <CreditCard className="w-4 h-auto" />
                      Payment
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
                <DialogContent className="bg-white ">
                  <DialogHeader className="gap-4 ">
                    <DialogTitle className="text-2xl text-center ">
                      Delete Invoice?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                    <DialogFooter className="justify-center sm:justify-center">
                      <form action={deleteInvoiceAction} className="">
                        <input type="hidden" name="id" value={invoice.id} />
                        <Button
                          variant="destructive"
                          type="submit"
                          className="w-full text-start text-black  flex gap-2 items-center"
                        >
                          <Trash2 className="w-4 h-auto text-black" />
                          Delete Invoice
                        </Button>
                      </form>
                    </DialogFooter>
                  </DialogHeader>
                </DialogContent>
              </DropdownMenu>
            </Dialog>
          </div>
        </div>
        <div>
          <p className="text-3xl mb-3">${(invoice.value / 100).toFixed(2)}</p>

          <p className="text-lg mb-8">{invoice.description}</p>

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
            <li className="flex gap-4">
              <strong className="block w-28 flex-shrink-0 font-medium text-sm">
                Billing Email
              </strong>
              {/* <span>{invoice.email}</span> */}
              <span>{invoice.customer.email}</span>
            </li>
          </ul>
        </div>
      </Container>
    </main>
  );
}
