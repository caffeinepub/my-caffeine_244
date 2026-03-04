# অনলাইন জমি ক্রয়/বিক্রয়

## Current State
- Full D2C land marketplace with admin panel, listings, lawyers, news management
- Listings stored in localStorage via useLocalStore
- ListingDetailPage shows spec table, history, soil report, offer portal
- LandListing type does not have an images field
- No photo upload in admin listing form
- No print/PDF functionality anywhere

## Requested Changes (Diff)

### Add
- `images` field (string array of base64 data URLs) to the local listing data model
- Image upload widget in admin listing form: multi-image uploader (up to 8 images), drag-and-drop or click to select, preview thumbnails with delete button
- Image gallery on ListingDetailPage: show uploaded photos in a scrollable carousel/grid; fallback emoji if no images
- Print button on ListingDetailPage: opens browser print dialog with a clean print stylesheet
- PDF download button on ListingDetailPage: generates a PDF using the browser print-to-PDF flow (window.print with a print-specific CSS class) — no external library needed

### Modify
- `LandListing` local interface extended with optional `images?: string[]`
- `useLocalListings` and related read/write — no structural change needed, images are part of the listing object
- AdminPage `ListingsManagement`: listing form dialog gets an image upload section
- ListingDetailPage image gallery section replaces the emoji placeholder

### Remove
- Nothing removed

## Implementation Plan
1. Extend the local listing type with `images?: string[]` (frontend-only field, no backend change)
2. Build an `ImageUploader` component inside AdminPage: file input (accept image/*), FileReader to convert to base64, thumbnail grid with remove buttons, max 8 images
3. Add the ImageUploader to the listing form dialog under a new "ছবি" FormSection
4. In ListingDetailPage, replace the emoji placeholder div with a real image gallery: if listing.images has entries show them in a horizontal scrollable strip with a lightbox-style click handler; else show the old emoji placeholder
5. Add Print and PDF buttons to the ListingDetailPage (top-right area near breadcrumb or in a sticky action bar). Use window.print(). Add @media print CSS to index.css that hides nav/sidebar/buttons and shows the listing cleanly
