import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(users)/users/$userId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userId } = Route.useParams();

  return <div>Hello "/(users)/users/{userId}"!</div>;
}
