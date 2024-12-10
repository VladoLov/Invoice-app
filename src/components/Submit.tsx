"use client";

import { useFormStatus } from "react-dom";

import React from "react";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";

export default function SubmitButton() {
  const { pending } = useFormStatus();
  console.log("pending", pending);
  return (
    <Button className="w-full font-semibold relative">
      <span className={pending ? "text-transparent" : ""}>Submit</span>
      {pending && (
        <span className="absolute flex items-center justify-center w-full h-full text-gray-200">
          <LoaderCircle className="animate-spin" />
        </span>
      )}
    </Button>
  );
}
