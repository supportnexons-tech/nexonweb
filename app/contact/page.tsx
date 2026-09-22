import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Book a demo or scoping call with NEXONS GROUP. Email ${site.email}. Serving Pakistan and worldwide from Islamabad.`,
};

export default function ContactPage() {
  const { address } = site;

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about the operation."
        description="A kitchen, a farm, a group, or a custom system — in Pakistan or anywhere else in the world. Send the context. We will come back with a walkthrough in your timezone, not a generic pitch."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="mx-auto mb-8 flex max-w-3xl flex-col gap-4 rounded-[20px] border border-line bg-surface px-6 py-5 text-sm sm:flex-row sm:items-center sm:gap-10">
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 hover:text-signal">
              <Mail className="h-4 w-4 text-signal" />
              {site.email}
            </a>
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-signal" />
              {address.line1}, {address.city} {address.postal}, {address.country}
            </span>
          </div>
          <div className="mx-auto max-w-3xl rounded-[28px] border border-line bg-surface p-6 sm:p-10">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
