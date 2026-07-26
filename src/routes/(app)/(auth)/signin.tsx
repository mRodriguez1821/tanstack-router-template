import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(app)/(auth)/signin")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/(app)/(auth)/login"!</div>;
}
