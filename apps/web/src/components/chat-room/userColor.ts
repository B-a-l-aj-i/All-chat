// Deterministic avatar color per user, derived from their username so the same
// (anonymous) person is always the same color. The username itself is never
// shown — it only seeds the hue. Mid-dark lightness so the white icon reads.
function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function userColor(username: string) {
  const hue = hashString(username) % 360;
  return { avatarBg: `hsl(${hue} 60% 45%)` };
}
