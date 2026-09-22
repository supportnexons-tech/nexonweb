"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/Button";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent" | "error";

const interests = ["Nexon KDS", "Nexon POS", "Flockify", "Custom software", "Several products", "Not sure yet"];
const sites = ["1 site", "2–5 sites", "6–20 sites", "20+ sites"];

const field =
  "w-full rounded-xl border border-line bg-fill px-4 py-3 text-sm text-paper outline-none transition placeholder:text-mist/70 focus:border-signal/60 focus:ring-2 focus:ring-signal/15";

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-mist">
      {children}
      {optional && <span className="ml-1 normal-case tracking-normal text-mist/60">(optional)</span>}
    </span>
  );
}

function Select({ name, options, placeholder, required }: { name: string; options: string[]; placeholder: string; required?: boolean }) {
  const [value, setValue] = useState("");
  return (
    <div className="relative">
      <select
        name={name}
        required={required}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className={cn(field, "cursor-pointer appearance-none pr-10 [&>option]:bg-surface [&>option]:text-paper", !value && "text-mist/70")}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    if (get("_honey")) {
      setStatus("sent");
      return;
    }

    const name = get("name");
    const company = get("company");
    const interest = get("interest");

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${site.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Name: name,
          Company: company,
          Email: get("email"),
          "Phone / WhatsApp": get("phone"),
          "Interested in": interest,
          "Number of sites": get("sites") || "—",
          Message: get("message") || "—",
          _subject: `NEXONS enquiry — ${name} (${company}) — ${interest}`,
          _replyto: get("email"),
          _template: "table",
          _captcha: "false",
        }),
      });

      const payload = (await response.json()) as { success?: string | boolean };
      if (!response.ok || payload.success === "false" || payload.success === false) {
        throw new Error("Could not send");
      }

      setStatus("sent");
    } catch {
      setError(`Could not send your enquiry. Please email ${site.email}.`);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 text-signal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-paper">Thank you, we&apos;ve got your enquiry.</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-mist">Our team will get back to you within one business day.</p>
        <Button variant="outline" className="mt-6" onClick={() => setStatus("idle")}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-paper">Book a demo</h2>
        <p className="mt-1 text-sm text-mist">Takes less than a minute. We reply within one business day.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <Label>Full name</Label>
          <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="block">
          <Label>Company</Label>
          <input name="company" required autoComplete="organization" className={field} placeholder="Business name" />
        </label>
        <label className="block">
          <Label>Work email</Label>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
        </label>
        <label className="block">
          <Label>Phone / WhatsApp</Label>
          <input name="phone" type="tel" required autoComplete="tel" pattern="[+0-9 ()-]{7,20}" className={field} placeholder="+92 300 1234567" />
        </label>
        <label className="block">
          <Label>Interested in</Label>
          <Select name="interest" options={interests} placeholder="Select a product" required />
        </label>
        <label className="block">
          <Label optional>Number of sites</Label>
          <Select name="sites" options={sites} placeholder="Select" />
        </label>
      </div>

      <label className="block">
        <Label optional>Message</Label>
        <textarea name="message" rows={3} className={cn(field, "resize-y")} placeholder="Anything we should know before the call?" />
      </label>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? "Sending…" : "Book my demo"}
        </Button>
        <p className="text-xs text-mist">No spam. Your details stay with NEXONS.</p>
      </div>

      {status === "error" && <p className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
