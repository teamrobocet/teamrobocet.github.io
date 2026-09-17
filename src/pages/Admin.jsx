import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './Admin.css';
import '../components/Events.css';

import workshopImg from '../assets/images/Workshopes.png';
import competitionImg from '../assets/images/competetion.png';
import projectImg from '../assets/images/Projects.png';
import articleImg from '../assets/images/Article.png';
import talkSessionImg from '../assets/images/Talksession.png';
import achievementsImg from '../assets/images/Achievements.png';

const Admin = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "workshop",
      title: "Workshops",
      description: "Manage robotics, AI, and hardware workshops.",
      image: workshopImg
    },
    {
      id: "competition",
      title: "Competitions",
      description: "Manage Hackathons and RoboWars events.",
      image: competitionImg
    },
    {
      id: "project",
      title: "Projects",
      description: "Manage student-made robotics projects.",
      image: projectImg
    },
    {
      id: "article",
      title: "Articles",
      description: "Manage technical blogs and documentation.",
      image: articleImg
    },
    {
      id: "talk-sessions",
      title: "Talk Sessions",
      description: "Manage guest lectures and industry panels.",
      image: talkSessionImg
    },
    {
      id: "gallery",
      title: "Gallery",
      description: "Manage public photo repository.",
      image: "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "achievements",
      title: "Achievements",
      description: "Manage student and team accomplishments.",
      image: achievementsImg
    },
    {
      id: "tournaments",
      title: "Drishti Tournaments",
      description: "Live fixtures, teams, and scores for Drishti.",
      image: "https://images.unsplash.com/photo-1511516171575-de470f783ee1?auto=format&fit=crop&w=800&q=80"
    }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px'}}>
        <Link to="/" className="back-link">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        <h1>Admin Discover Hub</h1>
      </div>

      <div className="admin-category-selector">
        <p className="admin-instruction">Select a category to manage its events and registrations.</p>
        
        <div className="events-grid" style={{ marginTop: '40px' }}>
          {categories.map((cat, index) => (
            <motion.div 
              key={index} 
              className="event-category-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => navigate(`/admin/${cat.id}`)}
              style={{ cursor: 'pointer' }}
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
                    Enter <span className="arrow">→</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
