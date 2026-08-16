import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * tailwind-merge needs to know about the custom scales declared in the
 * `@theme` block of index.css, otherwise it cannot tell `text-md` (a size)
 * apart from `text-ink` (a color) when de-duplicating overrides.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['3xs', '2xs', 'md'],
      color: [
        'canvas',
        'surface',
        'subtle',
        'hairline',
        'hairline-soft',
        'hairline-teal',
        'hairline-top',
        'ink',
        'ink-soft',
        'ink-body',
        'ink-muted',
        'ink-subtle',
        'deep',
        'deep-soft',
        'success',
        'success-soft',
        'success-deep',
        'warning',
        'warning-soft',
        'warning-deep',
        'critical',
        'critical-soft',
        'critical-deep',
        'info',
        'info-soft',
        'neutral',
        'neutral-soft',
        'emergency',
        'accent-violet',
      ],
      radius: ['control', 'field', 'tile', 'card', 'panel'],
      shadow: ['hairline', 'card', 'lift', 'panel', 'topbar', 'fab', 'modal'],
      spacing: ['rail', 'rail-open', 'topbar'],
      animate: ['fade-up', 'fade-in', 'slide-in'],
    },
  },
})

/** Merge conditional class names, letting later Tailwind utilities win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
