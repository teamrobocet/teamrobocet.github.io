import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Events.css';

import workshopImg from '../assets/images/Workshopes_1.jpeg';
import competitionImg from '../assets/images/Competetion_1.jpg';
import projectImg from '../assets/images/Projects.png';
import articleImg from '../assets/images/Article.png';
import talkSessionImg from '../assets/images/Talksession_1.jpeg';
import achievementsImg from '../assets/images/Achievements.png';

const Events = () => {
  const categories = [
    {
      id: "workshop",
      title: "Workshops",
      description: "Hands-on sessions diving into robotics, AI, and hardware.",
      image: workshopImg
    },
    {
      id: "competition",
      title: "Competitions",
      description: "Hackathons, RoboWars, and algorithmic challenges.",
      image: competitionImg
    },
    {
      id: "project",
      title: "Projects",
      description: "Showcases of incredible student-made robotics projects.",
      image: projectImg
    },
    {
      id: "article",
      title: "Articles",
      description: "Technical blogs, research papers, and club documentation.",
      image: articleImg
    },
    {
      id: "talk-sessions",
      title: "Talk Sessions",
      description: "Guest lectures, alumni talks, and industry expert panels.",
      image: talkSessionImg
    },
    {
      id: "achievements",
      title: "Achievements",
      description: "Our team's victories and milestones.",
      image: achievementsImg
    }
  ];

  const navigate = useNavigate();

  return (
    <section id="events" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">Discover RoboCET</h2>
        
        <div className="events-grid">
          {categories.map((cat, index) => (
            <motion.div 
              key={index} 
              className="event-category-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => cat.id === 'achievements' ? navigate('/achievements') : navigate(`/events/${cat.id}`)}
            >
              <div className="card-bg-wrapper">
                <img src={cat.image} alt={cat.title} className="card-bg-img" />
                <div className="card-gradient-overlay"></div>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{cat.title}</h3>
                </div>
                <div className="card-body">
                  <p className="card-desc">{cat.description}</p>
                  <div className="btn-explore">
                    Explore <span className="arrow">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Events;
