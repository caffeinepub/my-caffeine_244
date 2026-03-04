# অনলাইন জমি ক্রয়/বিক্রয় (জমিবাজার)

## Current State
Full D2C land marketplace with:
- HomePage, ListingsPage, ListingDetailPage, ComparePage, LawyersPage, NewsPage, AdminPage
- Backend with full CRUD for listings, lawyers, news, offers, documents, property history, soil reports
- Basic design with green/gold color scheme
- Division-only dropdown (no districts/upazilas)
- Generic placeholder images in listing cards and detail pages
- Basic listing cards and form layout

## Requested Changes (Diff)

### Add
- Bangladesh districts data (64 districts) and upazilas (sub-districts) as cascading dropdowns across all filter panels and admin forms
- Sample data: 8+ realistic land listings with rich details, 6 lawyers, 5 news articles pre-populated
- How-It-Works section on HomePage (3-step buyer and seller guide)
- Testimonials section on HomePage (3 trust-building user reviews)
- Market stats section on HomePage (market trends)
- "Top Locations" section on HomePage showing popular districts with listing counts
- Rich hero section upgrade: background photo with search overlay, mobile-responsive
- Professional lawyer profile cards with ratings, experience badges
- News page with a featured top article and sidebar layout
- World-class listing cards: photo placeholder with gradient + land type icon, price-per-decimal prominent, animated hover effects
- Compare page enhancement: visual comparison chart/table with icons

### Modify
- ListingsPage filter panel: District dropdown (cascades from division), Upazila dropdown (cascades from district)
- AdminPage listing form: District and Upazila now use cascading Select components instead of plain text inputs
- HomePage stats: Replace static numbers with dynamic counts from backend
- SearchBar: Add district cascading dropdown
- Footer: Add 8-division quick links, richer content
- Header: Improve visual identity, add subtle gradient/border-bottom

### Remove
- Nothing removed

## Implementation Plan
1. Create `/src/frontend/src/utils/bangladeshData.ts` — full 64 districts + upazilas lookup table, division→districts mapping, district→upazilas mapping
2. Update `SearchBar.tsx` — add cascading district/upazila selects
3. Update `ListingsPage.tsx` — replace district/upazila free-text inputs with cascading selects using the data
4. Update `AdminPage.tsx` — replace district/upazila text inputs with cascading selects in listing form
5. Update `HomePage.tsx` — add How-It-Works, Testimonials, Top Locations, Market Stats sections; make stats dynamic
6. Update `ListingCard.tsx` — richer visual card with better photo placeholder, location display
7. Update `LawyersPage.tsx` — richer cards with star ratings, experience, specialization badges
8. Update `NewsPage.tsx` — featured article hero + sidebar layout
9. Update `ComparePage.tsx` — visual comparison with icons and color coding
10. Update `Footer.tsx` — richer with division quick links and contact info
11. Update `Header.tsx` — subtle visual improvement
12. Update `index.css` — global typography refinements, shadow-gold utility, more polish
13. Validate (typecheck + build)
