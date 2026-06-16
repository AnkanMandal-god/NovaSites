import { Navbar, Footer } from "./sections/Layout";
import { Hero } from "./sections/Hero";
import { WhatWeDo } from "./sections/WhatWeDo";
import { Metrics } from "./sections/Metrics";
import { Process } from "./sections/Process";
import { Portfolio } from "./sections/Portfolio";
import { Pricing } from "./sections/Pricing";
import { ConsultationForm } from "./sections/ConsultationForm";
import { Feedback } from "./sections/Feedback";
import { DataRain } from "./components/DataRain";

function App() {
  return (
    <div className="min-h-screen text-foreground flex flex-col" style={{ background: "transparent" }}>
      <DataRain />
      <Navbar />
      <main className="flex-1 relative z-10">
        <Hero />
        <WhatWeDo />
        <Metrics />
        <Process />
        <Portfolio />
        <Pricing />
        <ConsultationForm />
        <Feedback />
      </main>
      <Footer />
    </div>
  );
}

export default App;
