import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Component,
})

function Component() {
  return (
    <div>
      'Hello /_dashboard!'
      <Outlet />
    </div>
  )
}
