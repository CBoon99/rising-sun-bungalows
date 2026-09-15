# Rising Sun Bungalows — CMS

Customer editor: **https://rising-sun-bungalows.netlify.app/admin/**

They can change homepage copy, photos, prices, WhatsApp, Instagram, map pin, café badge, FAQs, and the thank-you page. Saves go to GitHub; Netlify rebuilds the site.

## One-time Netlify steps (after this is live)

Identity is **invite only**. Git Gateway is on (`CBoon99/rising-sun-bungalows`).

Invite the editor at **Identity → Invite users** → `risingsunbungalows@gmail.com` if they have not had an invite email. They set a password, then use `/admin/`.

Do not open registration.

**Booking form email:** `risingsunbungalows@gmail.com`  
Netlify Forms hook on `booking` → `submission_created` emails that address. The form does not send WhatsApp; the float button / footer number is for guests to message Gunawan.

## Local preview

```bash
npm install
npm start          # site at http://localhost:8080
npm run cms        # CMS proxy (second terminal)
```

Then open http://localhost:8080/admin/ — no login needed locally.

## What they should not expect

Layout, colours, and booking-form fields stay in code. New photos should be uploaded in the CMS (they land in `assets/uploads/`). Existing photos live in `assets/web/`.
