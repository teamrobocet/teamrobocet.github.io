import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings } from 'lucide-react';
import rwPoster from '../assets/drishti/rw.jpeg';
import rsPoster from '../assets/drishti/Rs.jpeg';
import rw1Poster from '../assets/drishti/rw1.jpeg';
import './AdminTournamentList.css';
import './AdminTournamentList.css';

const AdminTournamentList = () => {
  const navigate = useNavigate();

  const tournaments = [
    {
      id: 'robowar',
      name: 'Robo War',
      image: rwPoster
    },
    {
      id: 'robosoccer',
      name: 'Robo Soccer',
      image: rsPoster
    },
    {
      id: 'robowar-15kg',
      name: 'Robo War 15kg',
      image: rw1Poster
    }
  ];

  return (
    <div className="admin-tourney-list">
      <div className="admin-header">
        <Link to="/admin" className="back-link">
          <ArrowLeft size={20} /> Back to Hub
        </Link>
        <h1>Drishti Tournaments</h1>
      </div>

      <div className="dashboard-grid">
        {tournaments.map((t) => (
          <motion.div 
            key={t.id}
            className="admin-event-card"
            onClick={() => navigate(`/admin/tournaments/${t.id}`)}
          >
            <div className="card-image-wrapper" style={{display:'block'}}>
              <img src={t.image} alt={t.name} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
            </div>
            <div className="card-info">
              <h3>{t.name}</h3>
              <p>ID: {t.id}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <span className="settings-link"><Settings size={16}/> Manage Event</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminTournamentList;
