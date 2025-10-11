import { USER_CODE_BASE, USER_CODE_LENGTH, USER_CODE_PREFIX } from "@/constants/user";

const BASE = BigInt(USER_CODE_BASE);
const MODULO = BASE ** BigInt(USER_CODE_LENGTH);
const MULTIPLIER = 131n;

export function generateUserCode(seed: string | null | undefined): string {
  if (!seed) {
    return `${USER_CODE_PREFIX}${"0".repeat(USER_CODE_LENGTH)}`;
  }

  let hash = 0n;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * MULTIPLIER + BigInt(seed.charCodeAt(i))) % MODULO;
  }

  const base36 = hash.toString(Number(USER_CODE_BASE));
  const padded = base36.padStart(USER_CODE_LENGTH, "0").toUpperCase();

  return `${USER_CODE_PREFIX}${padded}`;
}
