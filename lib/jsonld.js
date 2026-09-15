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
  const tel = settings.whatsapp ? "+" + String(settings.whatsapp).replace(/^\+/, "") : undefined;
  const partnerId = url + "/#partner";
  const businessId = url + "/#business";
  const images = [og, abs(url, home.hero.image)].concat(
    (home.stay.photos || []).slice(0, 2).map((p) => abs(url, p.image))
  );

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
        publisher: { "@id": businessId },
      },
      {
        "@type": "Organization",
        "@id": partnerId,
        name: settings.operator_name || settings.dive_club_name,
        url: settings.operator_url || settings.dive_club_url,
        description: "SSI dive centre on Gili Meno. Partner with Rising Sun Bungalows.",
        logo: abs(url, "/assets/icon-512.png"),
        sameAs: [settings.dive_club_url].filter(Boolean),
      },
      {
        "@type": "LodgingBusiness",
        additionalType: "https://schema.org/GuestHouse",
        "@id": businessId,
        name: settings.business_name,
        alternateName: settings.alternate_names || [],
        url: url + "/",
        image: images,
        logo: abs(url, "/assets/icon-512.png"),
        description: settings.lodging_description || settings.seo.description,
        priceRange: settings.price_range,
        currenciesAccepted: settings.currency,
        paymentAccepted: settings.payment_accepted,
        checkinTime: settings.checkin,
        checkoutTime: settings.checkout,
        petsAllowed: !!settings.pets_allowed,
        numberOfRooms: settings.bungalow_count || undefined,
        telephone: tel,
        email: settings.contact_email || undefined,
        availableLanguage: "en",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Near Gili Meno harbour",
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
        containedInPlace: { "@type": "Place", name: "Gili Meno" },
        areaServed: [
          { "@type": "Place", name: "Gili Meno" },
          { "@type": "Place", name: "Gili Islands" },
          { "@type": "AdministrativeArea", name: "Lombok" },
        ],
        sameAs: [settings.instagram_url].filter(Boolean),
        additionalProperty: {
          "@type": "PropertyValue",
          name: "Partner",
          value: settings.operator_name || settings.dive_club_name,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            contactType: "reservations",
            email: settings.contact_email,
            telephone: tel,
            url: "https://wa.me/" + settings.whatsapp,
            availableLanguage: "en",
          },
        ],
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
            name: "Monthly / long stay Gili Meno",
            description: home.long_stay.pill_title,
            priceCurrency: settings.currency,
            url: url + "/#long-stay",
          },
          {
            "@type": "Offer",
            name: "Gili Meno dive and stay",
            description: "Bungalow nights at Rising Sun with scuba at Meno Dive Club",
            url: url + "/#diving",
          },
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": url + "/#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: url + "/" },
          { "@type": "ListItem", position: 2, name: "Stay", item: url + "/#bungalows" },
          { "@type": "ListItem", position: 3, name: "How to get to Gili Meno", item: url + "/#get-there" },
          { "@type": "ListItem", position: 4, name: "FAQ", item: url + "/#faq" },
          { "@type": "ListItem", position: 5, name: "Book", item: url + "/#book" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": url + "/#faqpage",
        mainEntity: (faqs.items || []).map((item) => ({
          "@type": "Question",
          "@id": url + "/#" + (item.id || "faq"),
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
};
