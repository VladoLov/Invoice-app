"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createAction } from "@/app/actions";
import { SyntheticEvent, useState } from "react";
import SubmitButton from "@/components/Submit";
import Form from "next/form";
import Container from "@/components/Container";

export default function New() {
  const [state, setState] = useState("ready");
  async function handleOnSubmit(e: SyntheticEvent) {
    /* e.preventDefault(); */ //for our form
    if (state === "pending") {
      e.preventDefault();
      return;
    }
    setState("pending");
    /*    const target = e.target as HTMLFormElement;
    startTransition(async () => {
      const formData = new FormData(target);
      await createAction(formData);
      console.log("hey");
    }); */
    // not need in next/form only for our form
  }
  return (
    <main className="max-w-5xl md:mx-auto flex flex-col justify-start mx-10 gap-4  my-12">
      <Container>
        <div className="flex justify-between">
          <h1 className="text-5xl font-bold"> Create Invoice</h1>
        </div>

        <Form
          action={createAction}
          onSubmit={handleOnSubmit}
          className="grid gap-4 max-w-xs"
        >
          <div>
            <Label className="block font-semibold mb-2 text-sm " htmlFor="name">
              Billing Name
            </Label>
            <Input id="name" name="name" type="text" />
          </div>
          <div>
            <Label
              className="block font-semibold mb-2 text-sm "
              htmlFor="email"
            >
              Billing Email
            </Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div>
            <Label
              className="block font-semibold mb-2 text-sm "
              htmlFor="value"
            >
              Billing Value
            </Label>
            <Input id="value" name="value" type="text" />
          </div>
          <div>
            <Label
              className="block font-semibold mb-2 text-sm "
              htmlFor="description"
            >
              Billing Description
            </Label>
            <Textarea id="description" name="description" />
          </div>
          <SubmitButton />
        </Form>
      </Container>
    </main>
  );
}
