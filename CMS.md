# Rising Sun Bungalows — CMS

Customer editor: **https://rising-sun-bungalows.netlify.app/admin/**

They can change homepage copy, photos, prices, WhatsApp, Instagram, map pin, café badge, FAQs, and the thank-you page. Saves go to GitHub; Netlify rebuilds the site.

## One-time Netlify steps (after this is live)

Identity + Git Gateway are not on until you click them:

1. Netlify → this site → **Integrations → Identity → Enable Identity**
2. Registration: **Invite only**
3. **Services → Git Gateway → Enable Git Gateway**
4. **Identity → Invite users** → customer email
5. Customer opens the invite, sets a password, then uses `/admin/`

Do not leave registration open.

**Booking form email:** `risingsunbungalows@gmail.com`  
After push: Netlify → Forms → booking → notifications → add that address (otherwise submissions stay on the Netlify account inbox).

## Local preview

```bash
npm install
npm start          # site at http://localhost:8080
npm run cms        # CMS proxy (second terminal)
```

Then open http://localhost:8080/admin/ — no login needed locally.

## What they should not expect

Layout, colours, and booking-form fields stay in code. New photos should be uploaded in the CMS (they land in `assets/uploads/`). Existing photos live in `assets/web/`.
