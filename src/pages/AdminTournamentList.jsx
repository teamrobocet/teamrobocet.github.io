import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Plus, Settings } from 'lucide-react';
import './AdminTournamentList.css';

const AdminTournamentList = () => {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTourney, setNewTourney] = useState({ id: '', name: '' });

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const q = collection(db, 'drishti_tournaments');
      const snap = await getDocs(q);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTournaments(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTourney.id || !newTourney.name) return;
    
    // Normalize ID
    const formattedId = newTourney.id.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    
    try {
      await setDoc(doc(db, 'drishti_tournaments', formattedId), {
        name: newTourney.name,
        status: 'Upcoming',
        createdAt: serverTimestamp()
      });
      setTournaments([...tournaments, { id: formattedId, name: newTourney.name, status: 'Upcoming' }]);
      setIsModalOpen(false);
      setNewTourney({ id: '', name: '' });
    } catch (err) {
      console.error(err);
      alert("Failed to create tournament.");
    }
  };

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
            <div className="card-image-wrapper" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'#111'}}>
              <Trophy size={60} color="var(--accent-color)" />
              <div className={`status-badge ${t.status?.toLowerCase().replace(' ', '-')}`}>
                {t.status}
              </div>
            </div>
            <div className="card-info">
              <h3>{t.name}</h3>
              <p>ID: {t.id}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <span className="settings-link"><Settings size={16}/> Manage</span>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.div 
          className="admin-event-card create-new-card"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={48} className="plus-icon" />
          <h3>Add Tournament</h3>
        </motion.div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <h2>Create New Tournament</h2>
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group">
                <label>Tournament Name</label>
                <input type="text" value={newTourney.name} onChange={e => setNewTourney({...newTourney, name: e.target.value})} required placeholder="e.g. Robo Soccer 2026" />
              </div>
              <div className="form-group">
                <label>Tournament ID (URL Slug)</label>
                <input type="text" value={newTourney.id} onChange={e => setNewTourney({...newTourney, id: e.target.value})} required placeholder="e.g. robosoccer" />
              </div>
              <button type="submit" className="btn-primary">Create Tournament</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTournamentList;
