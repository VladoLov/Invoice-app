import React from "react";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="mt-12 mb-8">
      <Container className="flex justify-between gap-4">
        <p className="text-sm text-slate-500">
          Invoicpedia &copy; from 2024 to {new Date().getFullYear()}{" "}
        </p>
        <p className="text-sm text-slate-500">
          Created by Naxx Studio with Next.js, Xata, and Clerk
        </p>
      </Container>
    </footer>
  );
}
