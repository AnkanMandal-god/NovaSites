import { motion } from "framer-motion";

export function Metrics() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-primary font-mono text-sm mb-4">THE DIFFERENCE WE MAKE</div>
          <h2 className="text-4xl md:text-6xl mx-auto max-w-4xl text-white mb-6 !normal-case">
            The Standard<br />Has Been Raised.
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Traditional templates hold businesses back with bloat and slow load times. We engineer precise digital assets built for speed and lead generation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Failing Site */}
          <div className="bg-card border border-destructive/50 rounded-md p-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-8">Average Template Site</h3>
            <div className="w-48 h-48 relative mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="8" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0 251.2" }}
                  whileInView={{ strokeDasharray: "60.28 251.2" }}
                  transition={{ duration: 1 }}
                  cx="50" cy="50" r="40" stroke="#FF3333" strokeWidth="8" fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-destructive">24%</span>
                <span className="text-xs text-muted-foreground uppercase">Failing</span>
              </div>
            </div>
            
            <div className="w-full h-24 mb-6">
               <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                 <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "linear" }}
                    d="M 0 10 L 20 25 L 40 15 L 60 30 L 80 25 L 100 35" 
                    stroke="#FF3333" strokeWidth="2" fill="none" filter="drop-shadow(0px 0px 4px rgba(255,51,51,0.5))"
                 />
               </svg>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              📉 Stagnant user retention due to delayed page rendering.
            </p>
          </div>

          {/* WebForge Site */}
          <div className="bg-card border border-primary shadow-[0_0_15px_rgba(0,229,255,0.1)] rounded-md p-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-white mb-8">WebForge Engineered Site</h3>
            <div className="w-48 h-48 relative mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle cx="50" cy="50" r="40" stroke="#2A2A2A" strokeWidth="8" fill="none" />
                <motion.circle
                  initial={{ strokeDasharray: "0 251.2" }}
                  whileInView={{ strokeDasharray: "248 251.2" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="50" cy="50" r="40" stroke="#00E5FF" strokeWidth="8" fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-primary">99%</span>
                <span className="text-xs text-muted-foreground uppercase">Excellent</span>
              </div>
            </div>

            <div className="w-full h-24 mb-6 relative group">
               <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-full">
                 <motion.path 
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    d="M 0 35 L 20 25 L 40 10 L 60 15 L 80 5 L 100 2" 
                    stroke="#00E5FF" strokeWidth="2" fill="none" filter="drop-shadow(0px 0px 4px rgba(0,229,255,0.8))"
                 />
               </svg>
               <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_90%,rgba(0,229,255,0.2)_100%)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>

            <p className="text-sm text-white text-center">
              📈 Sub-second loading speeds resulting in higher inbound call volume.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "⚙️", title: "Sub-Second Loading", text: "Optimized delivery" },
            { icon: "🌐", title: "Search Engine Optimization", text: "Native ranking structure" },
            { icon: "📱", title: "Mobile-First Responsiveness", text: "Fluid scaling" },
            { icon: "🔑", title: "Absolute Asset Ownership", text: "No monthly leasing" },
            { icon: "🔒", title: "Enhanced Security", text: "Hardened infrastructure" },
            { icon: "🛠️", title: "Maintenance-Free Stability", text: "Zero plugin bloat" },
            { icon: "🎯", title: "Conversion-Focused Architecture", text: "Lead generation logic" },
            { icon: "📈", title: "Scalable Framework", text: "Grows with you" }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border p-4 rounded text-center md:text-left flex flex-col md:flex-row items-center gap-3"
            >
              <div className="text-2xl opacity-80 filter drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]">{feature.icon}</div>
              <div>
                <div className="text-sm font-bold text-white mb-0.5">{feature.title}</div>
                <div className="text-xs text-muted-foreground">{feature.text}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
