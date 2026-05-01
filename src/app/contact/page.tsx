"use client";
import { CSSProperties, useState } from "react";
import { ScrollProgress } from "@/components/nav/ScrollProgress";
import { NavShell } from "@/components/nav/NavShell";
import { SubPageHero } from "@/components/sublayouts/SubPageHero";
import { EditorialField } from "@/components/brief/EditorialField";
import { EditorialButton } from "@/components/brief/EditorialButton";
import { FooterMini } from "@/components/closing/FooterMini";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [type, setType] = useState("");
  const [question, setQuestion] = useState("");
  const ready = name.trim() && email.trim() && question.trim();

  function send() {
    fetch("/api/brief", {
      method: "POST",
      body: JSON.stringify({ contact_name: name, contact_email: email, company, type, question }),
    }).then(() => alert("Sent. We'll be in touch within 48 hours."));
  }

  return (
    <>
      <ScrollProgress />
      <NavShell show />
      <SubPageHero slug="contact" wordmark="Begin" subtitle="A short conversation, privately." />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 32px 100px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
        >
          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            <EditorialField label="Your name" placeholder="Jane Smith" value={name} onChange={setName} autoFocus />
            <EditorialField label="Your email" placeholder="you@company.com" value={email} onChange={setEmail} type="email" />
            <EditorialField label="Company (optional)" placeholder="" value={company} onChange={setCompany} />
            <EditorialField label="Type of work" placeholder="Agent, knowledge experience, internal tool…" value={type} onChange={setType} />
            <EditorialField label="The question you're turning over" placeholder="How do we…" value={question} onChange={setQuestion} multiline />
            <div>
              <EditorialButton ready={!!ready} onClick={send}>
                Send · begin a brief
              </EditorialButton>
            </div>
          </div>

          {/* Direct details */}
          <aside style={detailsStyle}>
            <DetailRow label="Direct" value={<a href="mailto:hello@northtrack.studio" style={linkStyle}>hello@northtrack.studio</a>} />
            <DetailRow label="Calendar" value="30 min, no agenda" />
            <DetailRow label="Location" value="40.7128° N · 74.0060° W" />
            <DetailRow label="Response" value="Within 48 hours" />
          </aside>
        </div>
      </main>

      <FooterMini />
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={detailRowStyle}>
      <div style={detailLabelStyle}>{label}</div>
      <div style={detailValueStyle}>{value}</div>
    </div>
  );
}

const detailsStyle: CSSProperties = {
  paddingTop: 26,
  display: "flex",
  flexDirection: "column",
  gap: 24,
  borderLeft: "1px solid rgba(200, 168, 78, 0.1)",
  paddingLeft: 32,
};
const detailRowStyle: CSSProperties = {};
const detailLabelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.4em",
  color: "var(--color-gold)", textTransform: "uppercase", marginBottom: 6,
};
const detailValueStyle: CSSProperties = {
  fontFamily: "var(--font-serif)", fontStyle: "italic",
  fontWeight: 300, fontSize: "1rem", color: "var(--color-text-body)",
};
const linkStyle: CSSProperties = {
  color: "var(--color-text-body-soft)", textDecoration: "none", borderBottom: "1px solid var(--color-gold)",
};
