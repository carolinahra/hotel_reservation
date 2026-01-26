import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 16);
  const passwordHash = `${salt.toString("hex")}:${hash.toString("hex")}`;
  return passwordHash;
}

export function verifyPassword(storedPassword: string, password: string): boolean {
  const [saltHex, hashHex] = storedPassword.split(":");
  const salt = Buffer.from(saltHex, "hex");
  const hash = Buffer.from(hashHex, "hex");
  const candidate = scryptSync(password, salt, 16);

  return timingSafeEqual(hash, candidate);
}
