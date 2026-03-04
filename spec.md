# অনলাইন জমি ক্রয়/বিক্রয় (জমিবাজার)

## Current State

- Full D2C land marketplace with listings, lawyer directory, news, compare tool, and offer negotiation
- Backend: Motoko with LandListing, Lawyer, NewsArticle, Offer, UserProfile types; admin-only create/update/delete
- Frontend: HomePage, ListingsPage, ListingDetailPage, ComparePage, LawyersPage, NewsPage, AdminPage
- AdminPage has local username/password login (admin/admin123) separate from Internet Identity
- Header uses Internet Identity (useInternetIdentity) for public login — showing "লগইন করুন" button
- No public registration/registration page exists for buyers or sellers
- Sample data seeds on first load via useSampleData hook

## Requested Changes (Diff)

### Add
- `/register` route with a split registration page: two options — "বিক্রয়দাতা" (seller) and "ক্রয়গ্রহিতা" (buyer)
- Each registration option shows a professional form with name, phone, email, location, and role selection
- On submit, saves to backend via `saveCallerUserProfile()` and assigns role via `assignCallerUserRole()`
- RegisterPage linked from Header ("রেজিস্ট্রেশন করুন" button replaces "লগইন করুন")

### Modify
- Header: replace Internet Identity "লগইন করুন" button with "রেজিস্ট্রেশন করুন" button that navigates to `/register`
- Header: keep Admin link visible only when logged in as admin (existing behaviour)
- AdminPage: keep admin username/password login unchanged (admin/admin123)

### Remove
- Header: remove public Internet Identity login/logout flow for non-admin users (the handleAuth / login / clear calls)
- Header: remove the authenticated user avatar + logout button for non-admin users

## Implementation Plan

1. Create `src/frontend/src/pages/RegisterPage.tsx` — split-panel professional registration page with seller/buyer role selector and form fields (name, phone, email, location)
2. Add `/register` route in App.tsx
3. Update Header.tsx — replace login button with "রেজিস্ট্রেশন করুন" link button to `/register`; remove Internet Identity login flow for public users; keep admin nav link
4. Validate & build
