#!/usr/bin/env python3
"""Customer handover PDF for Rising Sun Bungalows."""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "Rising-Sun-Bungalows-Website-Handover.pdf"

SAND = colors.HexColor("#f7f3ec")
INK = colors.HexColor("#2a231c")
MUTED = colors.HexColor("#6b5f52")
SAGE = colors.HexColor("#5e6f5a")
GOLD = colors.HexColor("#9a7b4f")
CARD = colors.HexColor("#fffcf7")
LINE = colors.HexColor("#e4d8c8")
WHITE = colors.white


def styles():
    base = getSampleStyleSheet()
    s = {}
    s["kicker"] = ParagraphStyle(
        "kicker",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=GOLD,
        tracking=1.4,
        alignment=TA_CENTER,
        spaceAfter=6,
    )
    s["title"] = ParagraphStyle(
        "title",
        parent=base["Title"],
        fontName="Times-Bold",
        fontSize=22,
        leading=26,
        textColor=INK,
        alignment=TA_CENTER,
        spaceAfter=4,
    )
    s["subtitle"] = ParagraphStyle(
        "subtitle",
        parent=base["Normal"],
        fontName="Times-Italic",
        fontSize=12,
        leading=16,
        textColor=SAGE,
        alignment=TA_CENTER,
        spaceAfter=10,
    )
    s["lede"] = ParagraphStyle(
        "lede",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=INK,
        alignment=TA_CENTER,
        spaceAfter=12,
    )
    s["h"] = ParagraphStyle(
        "h",
        parent=base["Heading1"],
        fontName="Times-Bold",
        fontSize=13,
        leading=16,
        textColor=SAGE,
        spaceBefore=12,
        spaceAfter=6,
    )
    s["body"] = ParagraphStyle(
        "body",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13.5,
        textColor=INK,
        spaceAfter=7,
    )
    s["small"] = ParagraphStyle(
        "small",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=MUTED,
        spaceAfter=4,
    )
    s["th"] = ParagraphStyle(
        "th",
        parent=base["Normal"],
        fontName="Helvetica-Bold",
        fontSize=8.5,
        leading=12,
        textColor=WHITE,
    )
    s["td"] = ParagraphStyle(
        "td",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=12,
        textColor=INK,
    )
    s["url"] = ParagraphStyle(
        "url",
        parent=base["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=SAGE,
        alignment=TA_CENTER,
        spaceAfter=2,
    )
    s["foot"] = ParagraphStyle(
        "foot",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=MUTED,
        alignment=TA_CENTER,
    )
    s["bullet"] = ParagraphStyle(
        "bullet",
        parent=s["body"],
        leftIndent=12,
        bulletIndent=0,
        spaceAfter=3,
    )
    return s


def header_footer(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(SAND)
    canvas.rect(0, 0, w, h, fill=1, stroke=0)
    canvas.setFillColor(SAGE)
    canvas.rect(0, h - 8 * mm, w, 8 * mm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, 0, w, 10 * mm, fill=1, stroke=0)
    canvas.setFillColor(WHITE)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(18 * mm, h - 5.2 * mm, "Rising Sun Bungalows  ·  Gili Meno")
    canvas.drawRightString(w - 18 * mm, h - 5.2 * mm, "Website handover")
    canvas.setFont("Helvetica", 7.5)
    canvas.drawCentredString(
        w / 2,
        4 * mm,
        "Once you are happy with this site, we will point your own domain at it.  ·  Built by BoonMind  ·  boonmind.io",
    )
    canvas.setFillColor(INK)
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(w - 18 * mm, 4 * mm, f"{doc.page}")
    canvas.restoreState()


def table(rows, col_widths, header=True):
    t = Table(rows, colWidths=col_widths, repeatRows=1 if header else 0)
    cmds = [
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("BACKGROUND", (0, 1), (-1, -1), CARD),
        ("TEXTCOLOR", (0, 0), (-1, -1), INK),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
    ]
    if header:
        cmds += [
            ("BACKGROUND", (0, 0), (-1, 0), SAGE),
            ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ]
    t.setStyle(TableStyle(cmds))
    return t


def bullets(items, st):
    return ListFlowable(
        [ListItem(Paragraph(i, st["body"]), leftIndent=8, bulletColor=SAGE) for i in items],
        bulletType="bullet",
        start="•",
        leftIndent=14,
        bulletFontName="Helvetica",
        bulletFontSize=9,
        bulletColor=SAGE,
    )


def main():
    st = styles()
    usable = 174 * mm
    story = []

    story.append(Paragraph("WEBSITE HANDOVER", st["kicker"]))
    story.append(Paragraph("Rising Sun Bungalows", st["title"]))
    story.append(Paragraph("Gili Meno, Lombok  ·  five lumbung bungalows", st["subtitle"]))
    story.append(
        Paragraph(
            "A short guide to the live site, what is already set for search engines, "
            "and how you edit words and photos in the CMS. Please read this on your phone or laptop, "
            "then tell Carl when you are happy.",
            st["lede"],
        )
    )

    story.append(Paragraph("Current live address (please test here first)", st["h"]))
    story.append(
        Paragraph(
            '<link href="https://rising-sun-bungalows.netlify.app/">'
            "https://rising-sun-bungalows.netlify.app/</link>",
            st["url"],
        )
    )
    story.append(
        Paragraph(
            "This is the real public site right now. It is hosted on Netlify. "
            "<b>Your own domain name is not attached yet on purpose.</b> "
            "Look at this address, tap every button, try the booking form, check WhatsApp, "
            "and look at it on a phone. When you are happy, tell Carl and he will handle DNS "
            "and point your domain at this same site. Nothing you like will be rebuilt from scratch — "
            "we only change the address people type.",
            st["body"],
        )
    )

    story.append(Paragraph("What was built", st["h"]))
    story.append(
        Paragraph(
            "A one-page stay website for Rising Sun Bungalows: photos, prices, long-stay, café, "
            "how to get there from Bali and Lombok, a booking request form, and scuba with "
            "<b>Meno Dive Club</b>. The bungalows are <b>operated and run by Meno Dive Club</b>. "
            "Stay bookings are on this site; diving is booked at menodiveclub.com. "
            "There are <b>five</b> lumbung bungalows. Nightly from 500.000 IDR. "
            "Booking email: <b>risingsunbungalows@gmail.com</b>. "
            "WhatsApp is the number already on the site.",
            st["body"],
        )
    )
    story.append(
        Paragraph(
            "Behind the scenes the page is generated from your content (words and photos). "
            "When you save in the CMS, that content is stored and the public page is rebuilt. "
            "You do not need GitHub, code, or design tools.",
            st["body"],
        )
    )

    story.append(Paragraph("SEO — complete for this site. Please leave it.", st["h"]))
    story.append(
        Paragraph(
            "On-page and technical search work is finished to the current lodging-site standard "
            "(Google Search Central, mid-2026): unique facts in the HTML, complete lodging structured data, "
            "visible FAQs, a 1200×630 share card, and crawler files for Google and for AI assistants. "
            "There is nothing useful left to add on this page. Extra ranking from here comes from "
            "Google Business Profile, guest reviews, and a mention on menodiveclub.com — not from more tags. "
            "Please do not edit browser title, meta description, share image, or heading structure in the CMS. "
            "If a fact changes (price, bungalow count), tell Carl or change only that fact.",
            st["body"],
        )
    )
    story.append(
        Paragraph(
            "<b>Checks run before this handover:</b> independent SEO review of the live URL against the source; "
            "heading map H1–H5; JSON-LD graph check; robots.txt user-agent grouping; "
            "keyword and long-tail map (Gili Meno bungalows, harbour stay, Bali fast boat, Bangsal, "
            "Gili Islands, dive and stay, Meno Dive Club); confirmation that menodiveclub.com is the official "
            "dive brand and URL; share-card dimensions 1200×630 with exact type; "
            "discovery files llms.txt, llms-full.txt, agents.txt, ai.txt, .well-known/ai.json, sitemap.xml. "
            "Guidance used: Google’s July 2026 note on generative AI in Search (helpful unique content, "
            "standard crawlability — Google does not rank llms.txt), plus 2026 lodging schema / GEO checklists.",
            st["body"],
        )
    )

    seo_rows = [
        [Paragraph("<b>What was done</b>", st["th"]), Paragraph("<b>On the live site</b>", st["th"])],
        [
            Paragraph("Google snippet", st["td"]),
            Paragraph(
                "Title: Rising Sun Bungalows | Gili Meno bungalows from 500K IDR. "
                "Description: five lumbung, 2 min from harbour, operated by Meno Dive Club, "
                "500.000 IDR/night, fast boat from Bali, dive and stay.",
                st["td"],
            ),
        ],
        [
            Paragraph("WhatsApp / Facebook share", st["td"]),
            Paragraph(
                "OG title, description, and a 1200×630 card with exact text "
                "(name, five lumbung, 500.000 IDR, operated by Meno Dive Club). Do not replace the share image.",
                st["td"],
            ),
        ],
        [
            Paragraph("Headings H1–H5", st["td"]),
            Paragraph(
                "H1 Rising Sun Bungalows. H2s: stay, long stay, café, untouched Gili Island, "
                "dive and stay, how to get to Gili Meno, FAQs, book. H3–H5 only where there is real content "
                "(amenities, rates, routes, FAQ questions, harbour arrival).",
                st["td"],
            ),
        ],
        [
            Paragraph("Copy / long-tail", st["td"]),
            Paragraph(
                "Harbour walk, Gili Islands, Bali fast boat (Sanur / Serangan / Padang Bai), "
                "Bangsal, LOP, Gili Trawangan vs Meno, monthly Wi-Fi stay, dive and stay, "
                "five bungalows, operated by Meno Dive Club. “Gili Meno Dive Club” only as a search variant.",
                st["td"],
            ),
        ],
        [
            Paragraph("Google structured data", st["td"]),
            Paragraph(
                "LodgingBusiness + GuestHouse, Organization (Meno Dive Club as operator), "
                "FAQPage (visible questions, matching IDs), WebSite, BreadcrumbList, contact, geo, offers. "
                "No fake star rating.",
                st["td"],
            ),
        ],
        [
            Paragraph("Crawlers &amp; assistants", st["td"]),
            Paragraph(
                "robots.txt (admin blocked for all bots), sitemap, llms.txt, llms-full.txt, "
                "agents.txt, ai.txt, .well-known/ai.json. AI crawlers allowed (GPTBot, OAI-SearchBot, Claude, Perplexity, Google-Extended).",
                st["td"],
            ),
        ],
        [
            Paragraph("Usability / technical", st["td"]),
            Paragraph(
                "Canonical, hreflang, skip links, breadcrumb trail, branded 404, WebP photos, "
                "lazy-load, visible NAP (address, email, WhatsApp). Search-category SEO can sit at 100. "
                "A photo-heavy homepage will not score 100 on “page speed” — that is the photos, not a missing tag.",
                st["td"],
            ),
        ],
    ]
    story.append(table(seo_rows, [42 * mm, usable - 42 * mm]))
    story.append(Spacer(1, 6))

    story.append(Paragraph("How you log in to the CMS", st["h"]))
    story.append(
        Paragraph(
            "The editor is here (same site, /admin at the end):",
            st["body"],
        )
    )
    story.append(
        Paragraph(
            '<link href="https://rising-sun-bungalows.netlify.app/admin/">'
            "https://rising-sun-bungalows.netlify.app/admin/</link>",
            st["url"],
        )
    )
    story.append(bullets(
        [
            "Carl will send you a <b>Netlify invite</b> to your email. Open that email on the same phone or computer you will use to edit.",
            "Click the invite, set a password. Keep it somewhere safe. This is not a Google login unless you choose that option.",
            "Go to the /admin/ link above and sign in.",
            "If the page asks you to log in and nothing happens, wait for Carl’s invite — the lock is on until that email is sent.",
            "Do not share the login outside the family who should edit the site.",
        ],
        st,
    ))

    story.append(Paragraph("How to use the CMS (once you are in)", st["h"]))
    story.append(
        Paragraph(
            "On the left you will see collections. Open one, change the fields, then "
            "<b>Save / Publish</b>. The public site usually updates in one or two minutes. "
            "Refresh the live page (not /admin) to see it. If a photo looks huge, wait — the rebuild may still be running.",
            st["body"],
        )
    )

    cms_rows = [
        [Paragraph("<b>Open this</b>", st["th"]), Paragraph("<b>You can change</b>", st["th"])],
        [
            Paragraph("Site settings", st["td"]),
            Paragraph(
                "Price, number of bungalows (5), WhatsApp number, booking email, Instagram, "
                "map pin, check-in / check-out times, café is not here — café is on Homepage.",
                st["td"],
            ),
        ],
        [
            Paragraph("Homepage", st["td"]),
            Paragraph(
                "Hero words and photo, key facts, stay text and gallery, long stay, café badge "
                "(“Opening soon”), island cards, diving words, how to get there, booking form labels.",
                st["td"],
            ),
        ],
        [
            Paragraph("FAQs (Google)", st["td"]),
            Paragraph("Questions at the bottom of the page (price, operator, boats, dive and stay, five bungalows, monthly, contact, pets).", st["td"]),
        ],
        [
            Paragraph("Thank-you page", st["td"]),
            Paragraph("The short message after someone sends a stay request.", st["td"]),
        ],
        [
            Paragraph("New photos", st["td"]),
            Paragraph(
                "Use the image picker and upload. New files go into the uploads folder. "
                "Keep photos upright, well lit, and of the real bungalows. Add a short alt description "
                "(what is in the picture).",
                st["td"]),
        ],
    ]
    story.append(table(cms_rows, [38 * mm, usable - 38 * mm]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Please do — and please don’t", st["h"]))
    do_dont = [
        [
            Paragraph("<b>Please do</b>", st["th"]),
            Paragraph("<b>Please don’t</b>", st["th"]),
        ],
        [
            Paragraph(
                "Update prices, café news, monthly-rate wording, photos of the five bungalows, "
                "WhatsApp number, and FAQs when something actually changes.",
                st["td"],
            ),
            Paragraph(
                "Do not change colours, layout, fonts, or the “Search / social” SEO boxes "
                "(browser title, meta description, share image) unless Carl is with you. "
                "That work is already set. Changing it for fun will mess up Google and WhatsApp previews.",
                st["td"],
            ),
        ],
        [
            Paragraph(
                "Keep stay bookings as Rising Sun Bungalows. The site is operated and run by Meno Dive Club. "
                "Official dive name: Meno Dive Club — not “Gili Meno Center”.",
                st["td"],
            ),
            Paragraph(
                "Do not invent a café opening date, a monthly price, or room occupancy unless it is true. "
                "Do not delete whole sections. Do not publish other people’s photos without permission.",
                st["td"],
            ),
        ],
    ]
    story.append(table(do_dont, [usable / 2, usable / 2]))
    story.append(Spacer(1, 8))

    story.append(Paragraph("Booking form", st["h"]))
    story.append(
        Paragraph(
            "Guests request dates on the site. There is no card payment on the form. "
            "Replies should go to <b>risingsunbungalows@gmail.com</b>. "
            "Check that inbox (and spam) after a test booking. "
            "If a test does not arrive, tell Carl — the mailbox routing is a one-time Netlify setting on his side.",
            st["body"],
        )
    )

    story.append(Paragraph("When you are happy — domain / DNS", st["h"]))
    story.append(
        Paragraph(
            "This is the important bit for later: <b>once you have looked at "
            "https://rising-sun-bungalows.netlify.app/ and you are happy, tell Carl. "
            "He will then set DNS and put the site on your own domain.</b> "
            "Do not change domain settings at your registrar until he asks — a wrong click can take the site offline. "
            "Until then, share the Netlify link, or wait for the proper address.",
            st["body"],
        )
    )
    story.append(
        Paragraph(
            "Questions, a login invite, or something that looks wrong: WhatsApp Carl, or write "
            "risingsunbungalows@gmail.com and copy him in. Built by BoonMind — boonmind.io. "
            "Handover date: 2 September 2026. SEO pass dated to current (August–September 2026) search guidance.",
            st["body"],
        )
    )

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=16 * mm,
        title="Rising Sun Bungalows — website handover",
        author="BoonMind",
        subject="Customer CMS and review guide for the live Netlify site",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)
    print("wrote", OUT)


if __name__ == "__main__":
    main()
