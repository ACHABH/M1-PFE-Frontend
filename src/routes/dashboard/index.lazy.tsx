import { createLazyFileRoute } from '@tanstack/react-router'
import Profile from '../../components/profile'
import { useAuth } from "../../api/auth";

export const Route = createLazyFileRoute('/dashboard/')({
  component: Component
})

function Component() {
  const user = useAuth((user) => {
    if (user || import.meta.env.DEV) return;
  });

  return (
    <Profile userRole={user?.role ?? "admin"}/>
  )
}

