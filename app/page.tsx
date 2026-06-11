import AmbientBg from "@/components/renewal/AmbientBg";
import Nav from "@/components/renewal/Nav";
import Hero from "@/components/renewal/Hero";
import Marquee from "@/components/renewal/Marquee";
import Thesis from "@/components/renewal/Thesis";
import GallerySystem from "@/components/renewal/GallerySystem";
import AxvelaAI from "@/components/renewal/AxvelaAI";
import Scan from "@/components/renewal/Scan";
import ScanDetail from "@/components/renewal/ScanDetail";
import View from "@/components/renewal/View";
import Museum from "@/components/renewal/Museum";
import Passport from "@/components/renewal/Passport";
import Patents from "@/components/renewal/Patents";
import Ecosystem from "@/components/renewal/Ecosystem";
import About from "@/components/renewal/About";
import Contact from "@/components/renewal/Contact";
import Footer from "@/components/renewal/Footer";

export default function Home() {
  return (
    <>
      <AmbientBg />
      <Nav />
      <Hero />
      <Marquee />
      <Thesis />
      <div className="hairline" />
      <GallerySystem />
      <div className="hairline" />
      <AxvelaAI />
      <Scan />
      <ScanDetail />
      <div className="hairline" />
      <View />
      <div className="hairline" />
      <Museum />
      <div className="hairline" />
      <Passport />
      <div className="hairline" />
      <Patents />
      <div className="hairline" />
      <Ecosystem />
      <div className="hairline" />
      <About />
      <Contact />
      <Footer />
    </>
  );
}
