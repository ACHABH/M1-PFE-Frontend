
import { useLogin } from "../api/auth";

export function useAuth() {
  const query = useLogin()
}
