import { navigation } from "../config/navigation.js";
import { appConfig } from "../config/app.js";
import { useAuth } from "./use-auth.js";
import { usePersistentState } from "../lib/client-store.js";
export const defaultFlags = Object.fromEntries(
  appConfig.features.map((flag) => [flag, true])
);
export function useNavigation() {
  const { has } = useAuth();
  const [flags] = usePersistentState("feature-flags", defaultFlags);
  return navigation.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => has(item.permission) && (!item.feature || flags[item.feature])
    )
  })).filter((group) => group.items.length);
}
