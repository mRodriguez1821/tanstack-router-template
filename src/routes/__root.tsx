import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { AuthContextValue } from "@/common/context/authContextStore";
import { ToastHost } from "@/common/components/ToastHost";
import { ModalHost } from "@/common/hooks/useModal";
import { showDebugger } from "@/common/lib/env";

export interface RouterContext {
  auth: AuthContextValue;
}

const RootLayout = () => {
  return (
    <>
      <ToastHost />
      <ModalHost />
      <Outlet />
      {showDebugger && <TanStackRouterDevtools />}
    </>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
