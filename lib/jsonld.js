const load = require("./load-content");

function abs(siteUrl, p) {
  if (!p) return siteUrl;
  if (/^https?:\/\//.test(p)) return p;
  return siteUrl + (p.startsWith("/") ? p : "/" + p);
}

module.exports = function jsonld() {
  const settings = load.settings();
  const home = load.home();
  const faqs = load.faqs();
  const url = String(settings.site_url || "").replace(/\/$/, "");
  const og = abs(url, settings.seo.og_image);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": url + "/#website",
        url: url + "/",
        name: settings.business_name,
        description: settings.lodging_description || settings.seo.description,
        inLanguage: "en",
        publisher: { "@id": url + "/#business" },
      },
      {
        "@type": "LodgingBusiness",
        "@id": url + "/#business",
        name: settings.business_name,
        alternateName: settings.alternate_names || [],
        url: url + "/",
        image: (home.stay.photos || []).slice(0, 2).map((p) => abs(url, p.image)).concat([og]),
        logo: abs(url, settings.logo),
        description: settings.lodging_description || settings.seo.description,
        priceRange: settings.price_range,
        currenciesAccepted: settings.currency,
        paymentAccepted: settings.payment_accepted,
        checkinTime: settings.checkin,
        checkoutTime: settings.checkout,
        petsAllowed: !!settings.pets_allowed,
        numberOfRooms: settings.bungalow_count || undefined,
        telephone: settings.whatsapp ? "+" + String(settings.whatsapp).replace(/^\+/, "") : undefined,
        email: settings.contact_email || undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: settings.geo.locality,
          addressRegion: settings.geo.region,
          addressCountry: settings.geo.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: settings.geo.lat,
          longitude: settings.geo.lng,
        },
        hasMap:
          "https://www.openstreetmap.org/?mlat=" +
          settings.geo.lat +
          "&mlon=" +
          settings.geo.lng +
          "#map=16/" +
          settings.geo.lat +
          "/" +
          settings.geo.lng,
        sameAs: [settings.instagram_url].filter(Boolean),
        amenityFeature: (settings.amenities || []).map((name) => ({
          "@type": "LocationFeatureSpecification",
          name,
          value: true,
        })),
        makesOffer: [
          {
            "@type": "Offer",
            name: "Nightly bungalow stay",
            price: String(settings.nightly_price),
            priceCurrency: settings.currency,
            url: url + "/#book",
          },
          {
            "@type": "Offer",
            name: "Monthly / long stay",
            description: home.long_stay.pill_title,
            priceCurrency: settings.currency,
            url: url + "/#long-stay",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "/#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url + "/" },
          { "@type": "ListItem", position: 2, name: "Stay", item: url + "/#bungalows" },
          { "@type": "ListItem", position: 3, name: "How to get there", item: url + "/#get-there" },
          { "@type": "ListItem", position: 4, name: "FAQ", item: url + "/#faq" },
          { "@type": "ListItem", position: 5, name: "Book", item: url + "/#book" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": url + "/#faq",
        mainEntity: (faqs.items || []).map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@type": "TouristTrip",
        name: home.get_there.heading,
        description: home.get_there.intro,
        touristType: "Leisure travellers, divers, remote workers",
        itinerary: {
          "@type": "ItemList",
          itemListElement: (home.get_there.routes || []).slice(0, 3).map((route, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: route.kicker + " — " + route.title,
          })),
        },
      },
    ],
  };
};
