import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/(users)/users/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(users)/users/"!</div>
}
