import React from "react";
import Hero from "../Components/Hero";
import LatestCollection from "../Components/LatestCollection";
import BestSeller from "../Components/BestSeller";
import OurPolicy from "../Components/OurPolicy";
import NewsletterBox from "../Components/NewsletterBox";
import SlideInLeft from "../Components/SlideInLeft";

const Home = () => {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <section className="py-8 sm:py-12">
          <SlideInLeft delay={0.2}>
            <Hero />
          </SlideInLeft>
        </section>

        <section className="py-8 sm:py-12">
          <SlideInLeft delay={0.4}>
            <LatestCollection />
          </SlideInLeft>
        </section>

        <section className="py-8 sm:py-12">
          <SlideInLeft delay={0.6}>
            <BestSeller />
          </SlideInLeft>
        </section>

        <section className="py-8 sm:py-12">
          <SlideInLeft delay={0.8}>
            <OurPolicy />
          </SlideInLeft>
        </section>

        <section className="py-8 sm:py-12">
          <SlideInLeft delay={1.0}>
            <NewsletterBox />
          </SlideInLeft>
        </section>
      </div>
    </main>
  );
};

export default Home;
