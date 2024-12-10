"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex justify-center items-center flex-col gap-8 mt-32">
      <h2>Error: {error.message}</h2>
      <button
        className="bg-slate-300 rounded-md px-4 py-1"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
      <Button asChild>
        <Link href="/">Return to homepage</Link>
      </Button>
    </div>
  );
}
