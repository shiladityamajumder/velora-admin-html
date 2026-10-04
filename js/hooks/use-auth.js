import { usePersistentState } from "../lib/client-store.js";
import { can } from "../lib/permissions.js";
export function useAuth() {
  const [session, setSession] = usePersistentState(
    "enterprise-session",
    null
  );
  return {
    user: session,
    role: session?.role ?? null,
    has: (permission) => can(session?.role ?? null, permission),
    login: setSession,
    logout: () => setSession(null),
    switchRole: (role) => setSession((user) => user ? { ...user, role } : user)
  };
}
