import { API_URL } from "@/constant";

const USER_ID_KEY = "uid";

export interface AnonymousUser {
  id: string;
  username: string;
  is_anonymous: boolean;
}

// First visit: ask the server to mint an anonymous user, then remember its id.
// Return visits: the id is already in localStorage, so we skip the request —
// this guard is what stops a duplicate user row being created every visit.
export async function getOrCreateUser(): Promise<string> {
  const existing = localStorage.getItem(USER_ID_KEY);
  if (existing) return existing;

  const res = await fetch(`${API_URL}/create-local-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result: AnonymousUser = await res.json();

  if (!res.ok) {
    throw new Error((result as { error?: string }).error ?? "Could not create user");
  }

  localStorage.setItem(USER_ID_KEY, result.id);
  return result.id;
}
