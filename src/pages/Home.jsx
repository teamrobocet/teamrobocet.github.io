import React from 'react';
import Hero from '../components/Hero';
import DrishtiSection from '../components/DrishtiSection';
import About from '../components/About';
import Events from '../components/Events';
import Team from '../components/Team';
import Gallery from '../components/Gallery';
import Contact from '../components/Contact';

const Home = ({ isLoading }) => {
  return (
    <div className="home-page">
      <Hero isLoading={isLoading} />
      <div className="white-strip"></div>
      <About />
      <DrishtiSection />
      <Events />
      
      <Team />
      <Gallery />
      <Contact />
    </div>
  );
};

export default Home;
