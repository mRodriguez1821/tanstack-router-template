import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/common/components/layout/PublicLayout";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});
