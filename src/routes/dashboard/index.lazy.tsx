import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard/')({
  component: Component
})

function Component() {
  return <h1>Profile!!!</h1>
}
