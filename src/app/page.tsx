import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import { SignIn, SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-5xl mx-auto flex flex-col justify-center gap-4  text-center">
      <Container>
        <h1 className="text-5xl font-bold">Invoicipedia</h1>
        <p className="">
          <Button>
            <Link href="sign-up">Sign Up</Link>
          </Button>
        </p>
      </Container>
    </main>
  );
}
