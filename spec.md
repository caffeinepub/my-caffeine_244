# অনলাইন জমি ক্রয়/বিক্রয়

## Current State

A full D2C land marketplace with:
- HomePage with hero section, stats, features, how-it-works, popular areas, listings, lawyers directory, news feed
- AdminPage with listings, lawyers, and news management tabs
- All content is currently hardcoded in component files (stats, hero text, feature cards, how-it-works steps)

## Requested Changes (Diff)

### Add
- A new "সাইট সেটিংস" (Site Settings) tab in the AdminPage with a layout editor
- A `useSiteSettings` hook that stores site-wide settings in local React state (persistent via localStorage)
- Layout editor sections in admin:
  - Hero section: editable site title, tagline/subtitle, CTA button text
  - Stats section: editable 4 stat items (label + value)
  - "কীভাবে কাজ করে" section: editable 3 steps (title + description)
  - Features section: editable 4 feature cards (title + description)
  - Popular areas section: toggle visibility
  - Footer: editable copyright text
- Live preview note shown in the editor
- Save button that stores settings and shows success toast

### Modify
- AdminPage: add new "সাইট সেটিংস" tab with Palette icon
- HomePage: read hero title, tagline, stats, features, how-it-works from `useSiteSettings()` hook instead of hardcoded values
- Footer: read copyright text from settings

### Remove
- Nothing removed

## Implementation Plan

1. Create `src/frontend/src/hooks/useSiteSettings.ts` — a hook that manages site settings state with localStorage persistence. Exposes `settings` object and `updateSettings` function.
2. Update `AdminPage.tsx` — add new `SiteSettingsManagement` component with form fields for all editable sections. Add "সাইট সেটিংস" tab with Palette icon.
3. Update `HomePage.tsx` — replace hardcoded `stats`, `features`, `howItWorksSteps` arrays and hero text with values from `useSiteSettings()`.
4. Update `Footer.tsx` — read copyright text from settings.
