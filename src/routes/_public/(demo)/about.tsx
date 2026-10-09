import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_public/(demo)/about")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/about"!</div>;
}
