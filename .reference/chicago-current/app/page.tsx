import Hero from "@/components/Hero";
import SectionLaunch from "@/components/SectionLaunch";
import SectionRiverStory from "@/components/SectionRiverStory";
import SectionGreen from "@/components/SectionGreen";
import SectionTransition from "@/components/SectionTransition";
import SectionCity from "@/components/SectionCity";
import SectionSummit from "@/components/SectionSummit";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <>
      <Preloader />
      <ScrollProgress />
      <CustomCursor />

      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-bg focus:px-4 focus:py-2 focus:text-text"
      >
        Skip to content
      </a>

      <main id="main-content">
        <Hero />
        <SectionLaunch />
        <SectionRiverStory />
        <SectionGreen />
        <SectionTransition />
        <SectionCity />
        <SectionSummit />
      </main>

      <Footer />
    </>
  );
}
