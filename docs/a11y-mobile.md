# Mobile & Accessibility (A11y)

This template includes sensible defaults to ensure a great experience on mobile devices and for keyboard and screen‑reader users.

- Skip to content: A visually hidden link is injected in `src/app/layout.tsx`. Give each page or segment layout a unique main landmark, e.g. `<main id="main-content" tabIndex={-1}>…</main>`, to enable fast navigation.
- Landmarks & nav: `src/components/header.tsx` wraps top‑level actions in a `<nav aria-label="Primary">` and sets `aria-current="page"` on active links.
- Forms:
  - `src/components/ui/form.tsx` associates labels, controls, and messages via `aria-*` and `id` attributes automatically.
  - `FormError` and `FormSuccess` use live regions (`role="alert"` / `role="status"`) for timely announcements.
  - Inputs use helpful `autoComplete` and `inputMode` hints (e.g. `email`, `current-password`, `new-password`, `one-time-code`, `numeric`).
- Focus visibility: All interactive components include strong `:focus-visible` styles using Tailwind/shadcn tokens.
- Keyboard access: Custom click targets like the avatar uploader expose `role="button"`, proper `tabIndex`, labels, and Space/Enter activation.
- Mobile viewport: `export const viewport` is declared in `src/app/layout.tsx` for correct device scaling.

When adding new pages or forms:

1. Wrap your main content with a unique main landmark and ensure there’s a skip target.
2. Use the `ui/form` primitives so labels and errors are announced correctly.
3. Add `autoComplete` and `inputMode` on inputs to improve mobile keyboards and autofill.
4. Prefer buttons over links for actions; reserve links for navigation.
5. Keep focus states obvious and consistent with existing components.
