import { Link } from "@tanstack/react-router";
import weddingCard from "@/assets/wedding-card.jpg";
import invitations from "@/assets/invitations.jpg";
import greenCard from "@/assets/green.png";
import floralImg from "@/assets/bento/floral.jpeg";
import heritageImg from "@/assets/bento/heritage.jpeg";
import {
  BUSINESS_PHONE,
  BUSINESS_PHONE_DISPLAY,
  coreFaqs,
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
  type FaqItem,
} from "@/lib/seo";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export function GlobalStructuredData() {
  return (
    <>
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={localBusinessSchema()} />
    </>
  );
}

export function FaqSection({ items = coreFaqs }: { items?: FaqItem[] }) {
  return (
    <section className="bg-[#f5f0e6] px-6 py-20 text-[#1a1a1a] md:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a1538]">Questions</p>
        <h2 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
          Wedding card printing, answered with care
        </h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.question} className="border-t border-[#1a1a1a]/15 pt-5">
              <h3 className="font-serif text-2xl">{item.question}</h3>
              <p className="mt-3 text-sm leading-7 text-[#1a1a1a]/72">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
      <JsonLd data={faqSchema(items)} />
    </section>
  );
}

export function PremiumSeoSections() {
  return (
    <section className="bg-[#f5f0e6] px-6 py-24 text-[#1a1a1a] md:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#8a1538]">
              Thrissur, Kerala
            </p>
            <h2 className="mt-4 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
              Premium wedding invitation cards in Thrissur
            </h2>
          </div>
          <p className="text-base leading-8 text-[#1a1a1a]/72">
            Impressions Wedding Cards creates luxury wedding cards in Thrissur for couples who want
            refined paper, thoughtful design and printing that feels worthy of the occasion. Our
            studio serves Kerala, South India and families ordering premium wedding cards from
            across India.
          </p>
        </div>

        <div className="mt-16 grid gap-px bg-[#1a1a1a]/10 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Luxury wedding card printing services",
              copy: "Premium card stocks, textured papers, elegant envelopes, foil-ready artwork and careful finishing for wedding invitation cards in Thrissur.",
            },
            {
              title: "Custom wedding invitation designs",
              copy: "Personalised invitation layouts, wording, colours and stationery details for Hindu, Christian, Muslim and contemporary celebrations.",
            },
            {
              title: "Wedding card designers in Kerala",
              copy: "A design-led local team for families looking for wedding card shops in Thrissur with a more elevated, boutique approach.",
            },
            {
              title: "Serving Thrissur and Kerala",
              copy: "Visit Impressions Castle in Paravattani, Thrissur, or begin online through our collections and custom wedding invitation experience.",
            },
            {
              title: "Premium wedding cards India",
              copy: "A curated catalogue for families who need designer wedding cards, invitation card printing and personalised stationery.",
            },
            {
              title: "Why choose Impressions Wedding Cards",
              copy: "Elegant design language, real product photography, transparent consultation and careful printing for invitations guests remember.",
            },
          ].map((item) => (
            <article key={item.title} className="bg-[#f5f0e6] p-7">
              <h3 className="font-serif text-2xl tracking-tight">{item.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[#1a1a1a]/68">{item.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap gap-3">
          <Link
            to="/collections"
            className="rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-[#f5f0e6]"
          >
            Luxury wedding cards in Thrissur
          </Link>
          <Link
            to="/custom-wedding-invitations"
            className="rounded-full border border-[#1a1a1a]/20 px-6 py-3 text-sm font-semibold"
          >
            Custom wedding invitation designs
          </Link>
          <Link
            to="/contact"
            className="rounded-full border border-[#1a1a1a]/20 px-6 py-3 text-sm font-semibold"
          >
            Wedding card printing near me
          </Link>
        </div>
      </div>
    </section>
  );
}

type LandingPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: { title: string; copy: string }[];
  image?: "wedding" | "invitations" | "green" | "floral" | "heritage";
  faq?: FaqItem[];
};

const imageMap = {
  wedding: weddingCard,
  invitations,
  green: greenCard,
  floral: floralImg,
  heritage: heritageImg,
};

export function SeoLandingPage({
  eyebrow,
  title,
  intro,
  sections,
  image = "wedding",
  faq = coreFaqs,
}: LandingPageProps) {
  return (
    <main className="bg-[#f5f0e6] text-[#1a1a1a]">
      <section className="grid min-h-[78vh] items-center gap-12 px-6 py-20 md:px-12 lg:grid-cols-2">
        <div className="mx-auto max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#8a1538]">{eyebrow}</p>
          <h1 className="mt-5 font-serif text-5xl leading-tight tracking-tight md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 text-base leading-8 text-[#1a1a1a]/72">{intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/collections"
              className="rounded-full bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-[#f5f0e6]"
            >
              View wedding card collections
            </Link>
            <a
              href={`https://wa.me/${BUSINESS_PHONE.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[#1a1a1a]/20 px-6 py-3 text-sm font-semibold"
            >
              WhatsApp {BUSINESS_PHONE_DISPLAY}
            </a>
          </div>
        </div>
        <div className="mx-auto w-full max-w-xl overflow-hidden rounded-lg">
          <img
            src={imageMap[image]}
            alt={`${title} by Impressions Wedding Cards in Thrissur Kerala`}
            title={`${title} - Impressions Wedding Cards`}
            width={1024}
            height={1280}
            loading="eager"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </section>

      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-6xl gap-px bg-[#1a1a1a]/10 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="bg-[#f5f0e6] p-8">
              <h2 className="font-serif text-3xl tracking-tight">{section.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[#1a1a1a]/70">{section.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-6 pb-20 md:px-12">
        <div className="mx-auto max-w-5xl border-t border-[#1a1a1a]/15 pt-10">
          <h2 className="font-serif text-4xl tracking-tight">Explore the Impressions experience</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/" className="rounded-full border border-[#1a1a1a]/20 px-5 py-2.5 text-sm">
              Impressions Wedding Cards
            </Link>
            <Link
              to="/wedding-card-printing-thrissur"
              className="rounded-full border border-[#1a1a1a]/20 px-5 py-2.5 text-sm"
            >
              Wedding card printing Thrissur
            </Link>
            <Link
              to="/luxury-wedding-cards-kerala"
              className="rounded-full border border-[#1a1a1a]/20 px-5 py-2.5 text-sm"
            >
              Luxury wedding cards Kerala
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-[#1a1a1a]/20 px-5 py-2.5 text-sm"
            >
              Contact the Thrissur studio
            </Link>
          </div>
        </div>
      </section>

      <FaqSection items={faq} />
    </main>
  );
}
