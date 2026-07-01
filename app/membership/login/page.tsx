import { Suspense } from "react";
import MemberLoginPage from "./LoginContent";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-[var(--color-muted)]">
          Loading...
        </div>
      }
    >
      <MemberLoginPage />
    </Suspense>
  );
}
