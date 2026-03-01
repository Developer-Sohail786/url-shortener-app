export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Register from "./register-component";

export default function Page() {
  return (
    <Suspense>
      <Register />
    </Suspense>
  );
}