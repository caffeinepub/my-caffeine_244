# জমিবাজার - D2C Land Marketplace

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add

**Backend Data Models:**
- Land listings with full specs (type, road access, area, price, price-per-decimal, location, division/district/upazila)
- Property history timeline entries per listing
- Soil & environment report per listing
- Document vault (encrypted document metadata) per listing
- Offer/negotiation records (buyer offer, seller counter, status)
- Lawyer directory profiles (name, specialization, contact, fee)
- News/newsfeed articles (title, content, date, category)
- Admin management: create/edit/delete listings, lawyers, news
- Featured listing support (boolean flag, display order)
- Legality checklist template
- Comparison data support (multiple listings side-by-side)
- User roles: admin vs public viewer

**Frontend Pages & Features:**
1. **Hero / Home Page** - Clean search engine with tagline "সরাসরি মালিকের সাথে কথা বলুন", filter by division/district/upazila/price range
2. **Smart Listing Cards** - Price per decimal prominently displayed, land type icon, road access, featured badge
3. **Listing Detail Page:**
   - Interactive specification table with icons (land elevation, road type, area, orientation)
   - Property history timeline
   - Soil & environment report section
   - Map placeholder with polygon boundary display
   - Points of Interest section
   - Drone/video player section
   - Digital Document Vault (request access button)
   - Legality checklist (auto-generated steps)
   - Verified Direct Contact (WhatsApp button)
   - Offer Negotiation Portal (send offer, counter, accept/reject)
4. **Comparison Tool** - Select up to 3 listings, compare side-by-side (road width, price, documents status)
5. **Lawyer Directory** - Partner lawyers with contact and fee info
6. **Newsfeed** - Land law updates, area market rates
7. **Admin Panel** (login-protected):
   - Manage listings (CRUD, featured toggle)
   - Manage lawyers
   - Manage news articles
   - View offers/negotiations

### Modify
Nothing (new project).

### Remove
Nothing (new project).

## Implementation Plan

1. Select `authorization` and `blob-storage` components
2. Generate Motoko backend with models for: listings, offers, lawyers, news, documents, admin ops
3. Build frontend with all pages using React + Tailwind, Bengali language primary
4. Admin panel protected by authorization component
5. Offer negotiation flow with state machine (pending → accepted/rejected/countered)
6. Document vault with access-request UI
7. Legality checklist as interactive step-by-step guide
8. Comparison tool with side-by-side table
9. Lawyer directory page
10. Newsfeed page
