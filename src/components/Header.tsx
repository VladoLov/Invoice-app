import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Container from "./Container";
import Link from "next/link";
export default function Header() {
  return (
    <header className="mt-8 mb-12 ">
      <Container>
        <div className="flex justify-between items-center gap-4">
          <p className="bold">
            <Link href="/dashboard">Invoicpedia</Link>
          </p>
          <div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  );
}
