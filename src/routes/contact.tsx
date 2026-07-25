import { createFileRoute } from "@tanstack/react-router";
import { SharedHeader } from "@/components/shared-header";
import { JsonLd } from "@/components/seo";
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_SECONDARY,
  MAPS_URL,
  breadcrumbSchema,
  canonicalLink,
  localBusinessSchema,
  seoMeta,
} from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: seoMeta({
      title: "Contact Wedding Card Shop in Thrissur | Impressions Wedding Cards",
      description:
        "Contact Impressions Wedding Cards at Impressions Castle, Paravattani, Thrissur for premium wedding card printing, custom invitations and designer stationery.",
      path: "/contact",
    }),
    links: [canonicalLink("/contact")],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f5f0e6] text-[#1a1a1a]">
      <SharedHeader />
      <section className="grid min-h-[72vh] items-center gap-12 px-6 py-20 md:px-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8a1538]">
            Thrissur wedding card studio
          </p>
          <h1 className="mt-5 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
            Contact Impressions Wedding Cards
          </h1>
          <p className="mt-6 text-base leading-8 text-[#1a1a1a]/72">
            Visit Impressions Castle in Paravattani, Thrissur, or enquire online for luxury wedding
            invitation cards, custom wedding invitations and premium card printing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={`tel:${BUSINESS_PHONE}`}
              className="rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-[#f5f0e6]"
            >
              Call {BUSINESS_PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${BUSINESS_PHONE.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#1a1a1a]/20 px-6 py-3 text-sm font-semibold"
            >
              WhatsApp enquiry
            </a>
          </div>
        </div>

        <div className="mx-auto w-full max-w-xl">
          <div className="border-t border-[#1a1a1a]/15 py-6">
            <h2 className="font-serif text-3xl">Impressions Castle</h2>
            <address className="mt-4 space-y-1 text-sm not-italic leading-7 text-[#1a1a1a]/70">
              <p>Impressions Castle, Paravattani</p>
              <p>Opp. Childrens Park, East Fort P.O.</p>
              <p>Thrissur, Kerala - 680005, India</p>
            </address>
          </div>
          <div className="border-t border-[#1a1a1a]/15 py-6">
            <h2 className="font-serif text-3xl">Opening hours</h2>
            <p className="mt-4 text-sm leading-7 text-[#1a1a1a]/70">
              Monday to Saturday: 10 am - 6 pm
              <br />
              Sunday: Closed
            </p>
            <p className="mt-4 text-sm text-[#1a1a1a]/70">
              Secondary phone:{" "}
              <a href={`tel:${BUSINESS_PHONE_SECONDARY}`} className="underline">
                +91 90200 77 999
              </a>
            </p>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#1a1a1a]/15">
            <iframe
              src="https://maps.google.com/maps?q=Impressions+Castle+Paravattani+Thrissur+Kerala&output=embed"
              width="100%"
              height="260"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Impressions Wedding Cards location in Thrissur"
            />
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex rounded-full border border-[#1a1a1a]/20 px-6 py-3 text-sm font-semibold"
          >
            Open Google Maps
          </a>
        </div>
      </section>
      <JsonLd data={localBusinessSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
    </main>
  );
}
