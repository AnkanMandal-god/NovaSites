import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "Do I own the code after the project is delivered?",
    a: "Yes — unconditionally. You receive the full source code, all assets, and every file. There are no licensing fees, no monthly subscriptions, and no dependency on our continued involvement. The site is yours to host, transfer, or hand to any developer.",
  },
  {
    q: "How long does a typical build take?",
    a: "Most projects are delivered within 5–10 business days from the point we have all content, copy, and brand assets. Larger multi-page builds or projects requiring extensive copywriting may extend this timeline, which we confirm at scoping.",
  },
  {
    q: "Do you use WordPress, Webflow, or page builders?",
    a: "No. Every site we ship is hand-coded from the ground up — no page builders, no CMS platforms, no plugin dependencies. This is the primary reason our sites are significantly faster and more secure than the industry average.",
  },
  {
    q: "What if I need to update content after launch?",
    a: "We offer a flat-rate content update service — submit a request and changes are turned around within 24–48 hours. Alternatively, we can build in a lightweight content management layer if you require frequent self-managed updates.",
  },
  {
    q: "How do you achieve sub-second load times?",
    a: "By eliminating every unnecessary byte: no plugin overhead, no unoptimized images, no render-blocking scripts. We use optimal asset delivery, semantic HTML, deferred loading patterns, and proper caching headers. The result is a PageSpeed score consistently above 95.",
  },
  {
    q: "Do you offer ongoing maintenance or hosting?",
    a: "We don't lock you into a hosting contract — you choose your own host and keep 100% of your infrastructure independence. For clients who prefer a managed arrangement, we offer an optional quarterly review and maintenance package.",
  },
  {
    q: "What information do you need to get started?",
    a: "To scope a project accurately, we need: your business name and location, target services or products, any existing brand guidelines, and your primary goal (leads, calls, e-commerce). Fill in the contact form below and we'll respond within one business day.",
  },
];

const ACCENT = "#00E5FF";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      id="faq"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.99)",
        padding: "80px 48px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 860, margin: "0 auto" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ marginBottom: 48 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ width: 16, height: 1, background: ACCENT, display: "inline-block" }} />
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: ACCENT }}>
              Frequently Asked
            </span>
          </div>
          <h2
            style={{
              fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)",
              fontWeight: 900,
              letterSpacing: "-0.01em",
              color: "#fff",
              margin: 0,
              lineHeight: 1.18,
            }}
          >
            Common Questions, <span style={{ color: ACCENT }}>Straight Answers.</span>
          </h2>
        </motion.div>

        {/* Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    background: isOpen ? "rgba(0,229,255,0.04)" : "rgba(255,255,255,0.02)",
                    border: "1px solid",
                    borderColor: isOpen ? "rgba(0,229,255,0.22)" : "rgba(255,255,255,0.07)",
                    borderRadius: isOpen ? "6px 6px 0 0" : 6,
                    padding: "18px 22px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    transition: "background 0.2s, border-color 0.2s",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isOpen ? "#fff" : "rgba(255,255,255,0.78)",
                      lineHeight: 1.4,
                      transition: "color 0.2s",
                    }}
                  >
                    {faq.q}
                  </span>
                  {/* +/− indicator */}
                  <span
                    style={{
                      flexShrink: 0,
                      width: 20,
                      height: 20,
                      border: `1px solid ${isOpen ? ACCENT : "rgba(255,255,255,0.25)"}`,
                      borderRadius: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isOpen ? ACCENT : "rgba(255,255,255,0.4)",
                      fontSize: 16,
                      fontWeight: 300,
                      lineHeight: 1,
                      transition: "border-color 0.2s, color 0.2s",
                    }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <div
                        style={{
                          background: "rgba(0,229,255,0.02)",
                          border: "1px solid rgba(0,229,255,0.12)",
                          borderTop: "none",
                          borderRadius: "0 0 6px 6px",
                          padding: "16px 22px 20px",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13.5,
                            lineHeight: 1.8,
                            color: "rgba(255,255,255,0.56)",
                            margin: 0,
                          }}
                        >
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
