export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Register from "./register-component";

export default function Page(){
  <Suspense>
    <Register/>
  </Suspense>
}