import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/admin/')({
  component: Component,
})

function Component() {
  return <div>Hello "/dashboard/admin/"!</div>
}
