export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Returns a slug guaranteed unique against the provided set, appending -2, -3, ... */
export function uniqueSlug(base: string, used: Set<string>): string {
  let slug = slugify(base);
  let candidate = slug;
  let i = 2;
  while (used.has(candidate)) {
    candidate = `${slug}-${i++}`;
  }
  used.add(candidate);
  return candidate;
}
