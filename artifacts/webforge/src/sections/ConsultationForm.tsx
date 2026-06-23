import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [services, setServices] = useState("");
  const [location, setLocation] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredTime, setPreferredTime] = useState("morning");
  const [notes, setNotes] = useState("");

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Consultation Request — ${businessName}`);
    const body = encodeURIComponent(
      `BUSINESS PROFILE\n` +
      `Business: ${businessName}\n` +
      `Services: ${services}\n` +
      `Location: ${location}\n\n` +
      `CONTACT DETAILS\n` +
      `Name: ${fullName}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n\n` +
      `SCHEDULE\n` +
      `Preferred Time: ${preferredTime}\n` +
      `Notes: ${notes || "None"}`
    );
    window.open(`mailto:ankan@novasites.co?subject=${subject}&body=${body}`);
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-12 md:py-24 bg-card/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <h2 className="text-xl sm:text-3xl mb-3 md:mb-4">
          <span className="anchor-prefix">//</span> Schedule a brief project consultation.
        </h2>
        <p className="text-muted-foreground text-sm mb-6 md:mb-12">
          Request a no-pressure, 10-minute audit call. We'll review your current digital footprint and outline the precise architecture required to capture your local market.
        </p>

        <div className="bg-card border border-border rounded-md overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }} />

          <div className="p-4 sm:p-8">
            {submitted ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-primary font-mono text-3xl sm:text-4xl mb-4">[OK]</div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Request Received</h3>
                <p className="text-muted-foreground text-sm">Your email client should have opened with the pre-filled request. We'll be in touch within one business day.</p>
                <p className="text-muted-foreground mt-3 font-mono text-xs">
                  Alternatively:{" "}
                  <a href="mailto:ankan@novasites.co" className="text-primary">ankan@novasites.co</a>{" "}
                  |{" "}
                  <a href="tel:+919547667707" className="text-primary">+91 95476 67707</a>
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="text-primary font-mono text-xs mb-4 md:mb-6">
                  STEP 0{step} // {step === 1 ? "BUSINESS PROFILE" : step === 2 ? "CONTACT DETAILS" : "SCHEDULE & SCOPE"}
                </div>

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Business Name</label>
                        <input type="text" required placeholder="Acme Corp" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Primary Services</label>
                        <input type="text" required placeholder="e.g. HVAC, Roofing, Consulting" value={services} onChange={(e) => setServices(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Location / City</label>
                        <input type="text" required placeholder="Kolkata, WB" value={location} onChange={(e) => setLocation(e.target.value)} />
                      </div>
                      <button type="button" onClick={nextStep} className="btn-primary w-full mt-3 md:mt-4">NEXT STEP</button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Full Name</label>
                        <input type="text" required placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Phone Number</label>
                        <input type="tel" required placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Email Address</label>
                        <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <button type="button" onClick={nextStep} className="btn-primary w-full mt-3 md:mt-4">NEXT STEP</button>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-3 md:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Preferred Reach Time</label>
                        <select required value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
                          <option value="morning">Morning (8am – 12pm)</option>
                          <option value="afternoon">Afternoon (12pm – 5pm)</option>
                          <option value="evening">Evening (5pm – 8pm)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Context / Pre-Call Notes (Optional)</label>
                        <textarea rows={4} placeholder="Tell us about your goals..." value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </div>
                      <button type="submit" className="btn-primary w-full mt-3 md:mt-4" style={{ fontSize: "clamp(9px, 2vw, 11px)" }}>
                        CONFIRM DETAILS & SUBMIT REQUEST
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
