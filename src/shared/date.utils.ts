export function toSqlDateTime(date: Date): string {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export function differenceInDays(dateA: Date, dateB: Date): number {
  const differenceInMilliseconds = Math.ceil(
    Math.abs(dateA.getTime() - dateB.getTime()),
  );
  return differenceInMilliseconds / (1000 * 60 * 60 * 24);
}

export function differenceInHours(dateA: Date, dateB: Date): number {
  const differenceInMilliseconds = Math.abs(dateA.getTime() - dateB.getTime());
  return Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
}

export function isExpiredDate(
  lastUpdate: Date,
  sessionExtensionMinutes: number,
): boolean {
  const expiresAt = lastUpdate.getTime() + sessionExtensionMinutes * 60 * 1000;
  return Date.now() > expiresAt;
}
