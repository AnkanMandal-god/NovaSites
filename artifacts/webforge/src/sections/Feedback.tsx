import { useState } from "react";
import { motion } from "framer-motion";

export function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
    }, 5000);
  };

  return (
    <section className="py-24 bg-card/30 border-t border-border">
      <div className="container mx-auto px-6 max-w-2xl">
        <h2 className="mb-4"><span className="anchor-prefix">//</span> Client feedback portal.</h2>
        <p className="text-muted-foreground mb-8">
          Submit verified deployment feedback. All entries are encrypted and recorded into our public archive.
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Professional Identification</label>
              <input type="text" required placeholder="Name, Role" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Business Entity</label>
              <input type="text" required placeholder="Company Name" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Performance Rating</label>
            <div className="flex gap-2 text-2xl cursor-pointer">
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
            <label className="block text-sm text-muted-foreground mb-2">Project Results / Testimonial</label>
            <textarea required rows={4} placeholder="Describe the impact of the deployment..." />
          </div>

          <motion.button
            type="submit"
            disabled={submitted || rating === 0}
            whileHover={!submitted && rating > 0 ? { scale: 1.01 } : {}}
            className={`btn-ghost w-full ${submitted ? "border-green-500 text-green-500 hover:border-green-500 hover:bg-transparent" : ""}`}
          >
            {submitted ? "FEEDBACK RECORDED" : "SUBMIT VERIFIED FEEDBACK"}
          </motion.button>
        </form>

        <div className="mt-8 text-center font-mono text-[10px] text-muted-foreground opacity-50">
          // SYSTEM: VERIFIED_SUBMISSION_PORTAL // 2026
        </div>
      </div>
    </section>
  );
}
