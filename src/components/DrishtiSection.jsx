import React from 'react';
import './DrishtiSection.css';
import logoImg from '../assets/drishti/Dhristilogo.png';
import titleImg from '../assets/drishti/Dhrishti.png';
import fullPoster from '../assets/drishti/Full.jpeg';
import rwPoster from '../assets/drishti/rw.jpeg';
import rsPoster from '../assets/drishti/Rs.jpeg';
import rw1Poster from '../assets/drishti/rw1.jpeg';

const DrishtiSection = () => {
  return (
    <section id="drishti" className="drishti-section">
      <div className="drishti-header" data-aos="fade-up">
        <img src={logoImg} alt="Drishti Logo" className="drishti-logo" />
        <img src={titleImg} alt="Drishti 26" className="drishti-title" />
      </div>

      <div className="drishti-main-poster-wrap" data-aos="fade-up" data-aos-delay="100">
        <img src={fullPoster} alt="Robowar and Robosoccer" className="drishti-main-poster" />
      </div>

      <div className="drishti-grid">
        {/* Robowar Card */}
        <div className="glass-panel drishti-card" data-aos="fade-right" data-aos-delay="100">
          <div className="drishti-card-image-wrap">
            <img src={rwPoster} alt="Robowar Event" className="drishti-card-image" />
          </div>
          <div className="drishti-card-content">
            <a href="https://discover.snaptiqz.com/event/upinPsGhoMnPCvLPtz1Hh" target="_blank" rel="noopener noreferrer" className="btn-primary drishti-btn">Register Now</a>
            <a href="https://drive.google.com/file/d/1xK3w5vq8G0bN4-hbUbX42dED4URRibv-/" target="_blank" rel="noopener noreferrer" className="btn-primary drishti-btn-outline">Rulebook</a>
          </div>
        </div>

        {/* Robosoccer Card */}
        <div className="glass-panel drishti-card" data-aos="fade-up" data-aos-delay="200">
          <div className="drishti-card-image-wrap">
            <img src={rsPoster} alt="Robosoccer Event" className="drishti-card-image" />
          </div>
          <div className="drishti-card-content">
            <a href="https://discover.snaptiqz.com/event/_7i_CVS3G0uet1apXPcE-" target="_blank" rel="noopener noreferrer" className="btn-primary drishti-btn">Register Now</a>
            <a href="https://drive.google.com/file/d/1xK3w5vq8G0bN4-hbUbX42dED4URRibv-/" target="_blank" rel="noopener noreferrer" className="btn-primary drishti-btn-outline">Rulebook</a>
          </div>
        </div>

        {/* New Competition Card */}
        <div className="glass-panel drishti-card" data-aos="fade-left" data-aos-delay="300">
          <div className="drishti-card-image-wrap">
            <img src={rw1Poster} alt="Competition Event" className="drishti-card-image" />
          </div>
          <div className="drishti-card-content">
            <a href="https://discover.snaptiqz.com/event/-iPlyrSOHJd78zkLt9roj" target="_blank" rel="noopener noreferrer" className="btn-primary drishti-btn">Register Now</a>
            <a href="https://drive.google.com/file/d/1xK3w5vq8G0bN4-hbUbX42dED4URRibv-/" target="_blank" rel="noopener noreferrer" className="btn-primary drishti-btn-outline">Rulebook</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DrishtiSection;
