import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, CheckCircle, Clock, PlayCircle } from 'lucide-react';
import logoImg from '../assets/drishti/Dhristilogo.png';
import titleImg from '../assets/drishti/Dhrishti.png';
import './TournamentPage.css';

const TournamentPage = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' or 'teams'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Tournament details
        const tRef = doc(db, 'drishti_tournaments', tournamentId);
        const tSnap = await getDoc(tRef);
        if (tSnap.exists()) {
          setTournament({ id: tSnap.id, ...tSnap.data() });
        } else {
          // If not created yet in DB, default it
          setTournament({
            id: tournamentId,
            name: tournamentId === 'robowar' ? 'Robo War' : tournamentId === 'robosoccer' ? 'Robo Soccer' : 'Line Follower',
            status: 'Upcoming'
          });
        }

        // Fetch Teams
        const teamsQ = query(collection(db, 'drishti_teams'), where('tournamentId', '==', tournamentId));
        const teamsSnap = await getDocs(teamsQ);
        setTeams(teamsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

        // Fetch Matches
        const matchesQ = query(collection(db, 'drishti_matches'), where('tournamentId', '==', tournamentId));
        const matchesSnap = await getDocs(matchesQ);
        const matchesData = matchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const sortMatches = (matchesArray) => {
          return [...matchesArray].sort((a, b) => {
            const statusPriority = { 'In Progress': 1, 'Scheduled': 2, 'Completed': 3 };
            const priorityA = statusPriority[a.status] || 4;
            const priorityB = statusPriority[b.status] || 4;
            if (priorityA !== priorityB) return priorityA - priorityB;
            const orderA = parseInt(a.orderIndex) || 0;
            const orderB = parseInt(b.orderIndex) || 0;
            if (orderA !== orderB) return orderA - orderB;
            return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
          });
        };

        setMatches(sortMatches(matchesData));

      } catch (err) {
        console.error("Error fetching tournament data", err);
      }
      setLoading(false);
    };

    fetchData();
  }, [tournamentId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Progress': return <PlayCircle size={16} color="#00ffcc" />;
      case 'Completed': return <CheckCircle size={16} color="#666" />;
      default: return <Clock size={16} color="#aaa" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'text-accent';
      case 'Completed': return 'text-gray-500';
      default: return 'text-gray-300';
    }
  };

  if (loading) {
    return <div className="tournament-page-loading">Initializing Live Status...</div>;
  }

  return (
    <div className="tournament-page">
      <div className="tournament-header glass-panel">
        <Link to="/#drishti" className="back-link">
          <ArrowLeft size={20} /> Back to Drishti
        </Link>

        <div className="drishti-brand">
          <img src={logoImg} alt="Drishti Logo" className="drishti-page-logo" />
          <img src={titleImg} alt="Drishti 26" className="drishti-page-title" />
        </div>

        <div className="title-wrapper">
          <h1 className="tournament-title">{tournament?.name || 'Tournament'}</h1>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
            onClick={() => setActiveTab('matches')}
          >
            <Trophy size={18} /> Fixtures & Results
          </button>
          <button 
            className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            <Users size={18} /> Participating Teams
          </button>
        </div>
      </div>

      <div className="tournament-content section-container">
        <AnimatePresence mode="wait">
          {activeTab === 'matches' && (
            <motion.div 
              key="matches"
              className="matches-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {matches.length === 0 ? (
                <div className="empty-state">No fixtures have been generated yet.</div>
              ) : (
                <div className="fixtures-list">
                  {matches.map((match) => (
                    <div key={match.id} className="match-card glass-panel">
                      <div className="match-header">
                        <span className="match-round">{match.round || 'League Match'}</span>
                        <span className={`match-status ${getStatusColor(match.status)}`}>
                          {getStatusIcon(match.status)} {match.status}
                        </span>
                      </div>
                      <div className="match-teams">
                        <div className={`team ${match.scoreA > match.scoreB && match.status === 'Completed' ? 'winner' : ''}`}>
                          {match.scoreA > match.scoreB && match.status === 'Completed' && (
                            <div className="winner-tag">WINNER</div>
                          )}
                          <span className="team-name">{match.teamAName}</span>
                          <span className="team-score">{match.scoreA ?? '-'}</span>
                        </div>
                        <div className="vs-divider">VS</div>
                        <div className={`team ${match.scoreB > match.scoreA && match.status === 'Completed' ? 'winner' : ''}`}>
                          {match.scoreB > match.scoreA && match.status === 'Completed' && (
                            <div className="winner-tag">WINNER</div>
                          )}
                          <span className="team-name">{match.teamBName}</span>
                          <span className="team-score">{match.scoreB ?? '-'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'teams' && (
            <motion.div 
              key="teams"
              className="teams-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {teams.length === 0 ? (
                <div className="empty-state">No teams have been added to this tournament yet.</div>
              ) : (
                <div className="teams-grid">
                  {teams.map((team) => (
                    <div key={team.id} className="team-card glass-panel">
                      <div className="team-icon">
                        <Users size={32} color="var(--accent-color)" />
                      </div>
                      <div className="team-info">
                        <h3>{team.name}</h3>
                        <p>{team.collegeName || 'College Not Specified'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TournamentPage;
