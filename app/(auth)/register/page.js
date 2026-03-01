import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // adjust path
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Register from "./register-component";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getServerSession(authOptions);

  // If already logged in then block register page
  if (session) {
    redirect("/shorten");
  }

  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}