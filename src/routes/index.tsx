import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Services } from "@/components/site/Services";
import { Showcase } from "@/components/site/Showcase";
import { WhyUs } from "@/components/site/WhyUs";
import { Gallery } from "@/components/site/Gallery";
import { Testimonials } from "@/components/site/Testimonials";
import { Team } from "@/components/site/Team";
import { BookingSection } from "@/components/site/BookingSection";
import { ChatWidget } from "@/components/site/ChatWidget";
import { BookingProvider } from "@/components/site/BookingProvider";
import { BackgroundVideo } from "@/components/site/BackgroundVideo";

const title = "LUXE Beauty Atelier — salon fryzjersko-kosmetyczny";
const description =
  "Fryzjerstwo, paznokcie, brwi, rzesy i kosmetologia w jednym miejscu. Umow wizyte online lub porozmawiaj z naszym asystentem.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <BookingProvider>
      <div className="site-video-page relative isolate min-h-screen overflow-hidden">
        <BackgroundVideo src="/media/orchid-petals-hero.mp4" poster="/media/orchid-petals-hero-poster.jpg" />
        <div className="relative z-10">
          <SiteHeader />
          <main>
            <Hero onChat={() => setChatOpen(true)} />
            <About />
            <Services />
            <Showcase />
            <Team />
            <WhyUs />
            <Gallery />
            <Testimonials />
            <BookingSection />
          </main>
          <SiteFooter />
          <ChatWidget open={chatOpen} setOpen={setChatOpen} />
        </div>
      </div>
    </BookingProvider>
  );
}
