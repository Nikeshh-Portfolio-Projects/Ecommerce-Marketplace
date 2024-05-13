import { Suspense } from "react";
import SignIn from "./sign-in";

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignIn />
      </Suspense>
    </div>
  );
}

export default Page
