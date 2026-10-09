import type { ReactNode } from "react";

export function AuthContainer({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-60px)] items-center justify-center p-4">
      {children}
    </div>
  );
}

export default AuthContainer;
