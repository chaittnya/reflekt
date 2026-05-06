/**
 * Lightweight className merger (without clsx/tailwind-merge dependency).
 * Filters falsy values and joins with space.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
