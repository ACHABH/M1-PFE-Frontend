import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/auth/login')({
  component() {
  return 'Hello /auth/login!'
},
})
