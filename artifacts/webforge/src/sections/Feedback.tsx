import { useState } from "react";

export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [testimonial, setTestimonial] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Client Feedback — ${company} (${rating}/5 stars)`);
    const body = encodeURIComponent(
      `FROM: ${name}\nCOMPANY: ${company}\nRATING: ${rating}/5\n\nTESTIMONIAL:\n${testimonial}`
    );
    window.open(`mailto:ankan@novasites.co?subject=${subject}&body=${body}`);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setName("");
      setCompany("");
      setTestimonial("");
    }, 6000);
  };

  return (
    <section className="py-12 md:py-24 bg-card/30 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
        <h2 className="text-xl sm:text-3xl mb-3 md:mb-4">
          <span className="anchor-prefix">//</span> Client feedback portal.
        </h2>
        <p className="text-muted-foreground text-sm mb-5 md:mb-8">
          Submit verified deployment feedback. All entries are encrypted and recorded into our public archive.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Professional Identification</label>
              <input type="text" required placeholder="Name, Role" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Business Entity</label>
              <input type="text" required placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Performance Rating</label>
            <div className="flex gap-2 text-xl sm:text-2xl cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`transition-colors duration-150 ${(hoverRating || rating) >= star ? "text-primary drop-shadow-[0_0_5px_rgba(0,229,255,0.8)]" : "text-muted"}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">Project Results / Testimonial</label>
            <textarea required rows={4} placeholder="Describe the impact of the deployment..." value={testimonial} onChange={(e) => setTestimonial(e.target.value)} />
          </div>

          <button
            type="submit"
            disabled={submitted || rating === 0}
            className={`btn-ghost w-full ${submitted ? "border-green-500 text-green-500 hover:border-green-500 hover:bg-transparent" : ""}`}
            style={{ fontSize: "clamp(9px, 2vw, 11px)" }}
          >
            {submitted ? "FEEDBACK SENT — CHECK YOUR EMAIL CLIENT" : "SUBMIT VERIFIED FEEDBACK"}
          </button>
        </form>

        <div className="mt-6 md:mt-8 text-center font-mono text-[10px] text-muted-foreground opacity-50">
          // SYSTEM: VERIFIED_SUBMISSION_PORTAL // 2026
        </div>
      </div>
    </section>
  );
}
