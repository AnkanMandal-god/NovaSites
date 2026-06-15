import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ConsultationForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const nextStep = () => setStep(s => Math.min(s + 1, 3));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-card/50 border-t border-border">
      <div className="container mx-auto px-6 max-w-3xl">
        <h2><span className="anchor-prefix">//</span> Schedule a brief project consultation.</h2>
        <p className="text-muted-foreground mb-12">
          Request a no-pressure, 10-minute audit call. We'll review your current digital footprint and outline the precise architecture required to capture your local market.
        </p>

        <div className="bg-card border border-border rounded-md overflow-hidden relative">
          <div className="absolute top-0 left-0 h-1 bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }} />
          
          <div className="p-8">
            {submitted ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Request Received</h3>
                <p className="text-muted-foreground">We'll be in touch shortly to confirm your consultation time.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit}>
                <div className="text-primary font-mono text-xs mb-6">
                  STEP 0{step} // {step === 1 ? "BUSINESS PROFILE" : step === 2 ? "CONTACT DETAILS" : "SCHEDULE & SCOPE"}
                </div>
                
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Business Name</label>
                        <input type="text" required placeholder="Acme Corp" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Primary Services</label>
                        <input type="text" required placeholder="e.g. HVAC, Roofing, Consulting" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Location / City</label>
                        <input type="text" required placeholder="Seattle, WA" />
                      </div>
                      <button type="button" onClick={nextStep} className="btn-primary w-full mt-4">NEXT STEP</button>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Full Name</label>
                        <input type="text" required placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Phone Number</label>
                        <input type="tel" required placeholder="(555) 123-4567" />
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                        <input type="email" required placeholder="john@example.com" />
                      </div>
                      <button type="button" onClick={nextStep} className="btn-primary w-full mt-4">NEXT STEP</button>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Preferred Reach Time</label>
                        <select required>
                          <option value="morning">Morning (8am - 12pm)</option>
                          <option value="afternoon">Afternoon (12pm - 5pm)</option>
                          <option value="evening">Evening (5pm - 8pm)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">Context / Pre-Call Notes (Optional)</label>
                        <textarea rows={4} placeholder="Tell us about your goals..." />
                      </div>
                      <button type="submit" className="btn-primary w-full mt-4">⚡ CONFIRM DETAILS & SUBMIT REQUEST</button>
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
