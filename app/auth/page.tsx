import Image from "next/image";
import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import { SignInWithGoogle } from "./_components/sign-in-with-google";

export default async function AuthPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (session.data?.user) redirect("/");

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-black">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/login-bg.jpg"
          alt=""
          fill
          className="object-cover object-right"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex justify-start pt-12 px-6">
        <p
          className="text-[28px] uppercase leading-none text-white"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>
      </div>

      <div className="flex-1" />

      <div className="relative z-10 flex flex-col gap-8 rounded-t-[40px] border-t border-white/10 bg-background px-6 pb-10 pt-10">
        <div className="flex w-full flex-col gap-6">
          <h1
            className="text-4xl uppercase leading-tight text-foreground"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            O app que vai transformar a forma como você treina.
          </h1>

          <SignInWithGoogle />
        </div>

        <p className="font-heading text-xs text-muted-foreground">
          ©{new Date().getFullYear()} Copyright FIT.AI. Todos os direitos reservados
        </p>
      </div>
    </div>
  );
}