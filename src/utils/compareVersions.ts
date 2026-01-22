/**
 * Compara duas versões no formato semântico (X.Y.Z)
 * @param v1 Primeira versão
 * @param v2 Segunda versão
 * @returns -1 se v1 < v2, 0 se v1 === v2, 1 se v1 > v2
 */
export function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split(".").map((part) => {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : num;
  });

  const parts2 = v2.split(".").map((part) => {
    const num = parseInt(part, 10);
    return isNaN(num) ? 0 : num;
  });

  const maxLength = Math.max(parts1.length, parts2.length);

  for (let i = 0; i < maxLength; i++) {
    const part1 = i < parts1.length ? parts1[i] : 0;
    const part2 = i < parts2.length ? parts2[i] : 0;

    if (part1 > part2) return 1;
    if (part1 < part2) return -1;
  }

  return 0;
}
