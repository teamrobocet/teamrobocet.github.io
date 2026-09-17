import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Trash2, Edit3, Plus, Save, Users, Trophy } from 'lucide-react';
import './AdminTournamentManage.css';

const AdminTournamentManage = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);
  
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ name: '', collegeName: '' });
  
  const [matches, setMatches] = useState([]);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [newMatch, setNewMatch] = useState({ teamA: '', teamB: '', round: 'League Match' });
  
  // For inline score editing
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editScoreData, setEditScoreData] = useState({ scoreA: 0, scoreB: 0, status: 'Scheduled' });

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId]);

  const fetchData = async () => {
    try {
      const tSnap = await getDoc(doc(db, 'drishti_tournaments', tournamentId));
      if (tSnap.exists()) setTournament({ id: tSnap.id, ...tSnap.data() });

      const teamsSnap = await getDocs(query(collection(db, 'drishti_teams'), where('tournamentId', '==', tournamentId)));
      setTeams(teamsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      const matchesSnap = await getDocs(query(collection(db, 'drishti_matches'), where('tournamentId', '==', tournamentId)));
      const matchesData = matchesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMatches(matchesData.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      await updateDoc(doc(db, 'drishti_tournaments', tournamentId), { status });
      setTournament({ ...tournament, status });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTeam = async (e) => {
    e.preventDefault();
    if (!newTeam.name) return;
    try {
      const docRef = await addDoc(collection(db, 'drishti_teams'), {
        ...newTeam,
        tournamentId,
        createdAt: serverTimestamp()
      });
      setTeams([...teams, { id: docRef.id, ...newTeam }]);
      setNewTeam({ name: '', collegeName: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Delete team?")) return;
    try {
      await deleteDoc(doc(db, 'drishti_teams', id));
      setTeams(teams.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMatch = async (e) => {
    e.preventDefault();
    if (!newMatch.teamA || !newMatch.teamB || newMatch.teamA === newMatch.teamB) {
      alert("Please select two distinct teams");
      return;
    }
    const teamAObj = teams.find(t => t.id === newMatch.teamA);
    const teamBObj = teams.find(t => t.id === newMatch.teamB);
    
    const matchData = {
      tournamentId,
      teamA: teamAObj.id,
      teamB: teamBObj.id,
      teamAName: teamAObj.name,
      teamBName: teamBObj.name,
      scoreA: 0,
      scoreB: 0,
      status: 'Scheduled',
      round: newMatch.round,
      createdAt: serverTimestamp()
    };
    
    try {
      const docRef = await addDoc(collection(db, 'drishti_matches'), matchData);
      setMatches([{ id: docRef.id, ...matchData, createdAt: new Date() }, ...matches]);
      setIsMatchModalOpen(false);
      setNewMatch({ teamA: '', teamB: '', round: 'League Match' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveScore = async (matchId) => {
    try {
      await updateDoc(doc(db, 'drishti_matches', matchId), editScoreData);
      setMatches(matches.map(m => m.id === matchId ? { ...m, ...editScoreData } : m));
      setEditingMatchId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMatch = async (id) => {
    if (!window.confirm("Delete match fixture?")) return;
    try {
      await deleteDoc(doc(db, 'drishti_matches', id));
      setMatches(matches.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-tourney-manage">
      <div className="admin-header">
        <Link to="/admin/tournaments" className="back-link">
          <ArrowLeft size={20} /> Back to Tournaments
        </Link>
        <h1>Manage {tournament?.name || 'Tournament'}</h1>
      </div>

      <div className="status-control glass-panel">
        <h3>Live Tournament Status</h3>
        <select 
          value={tournament?.status || 'Upcoming'} 
          onChange={(e) => handleUpdateStatus(e.target.value)}
          className="builder-input"
        >
          <option value="Upcoming">Upcoming</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="tm-grid">
        {/* Teams Section */}
        <div className="tm-section glass-panel">
          <div className="section-header">
            <h3><Users size={20}/> Teams ({teams.length})</h3>
          </div>
          
          <form onSubmit={handleAddTeam} className="add-form" style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
            <input type="text" placeholder="Team Name" value={newTeam.name} onChange={e=>setNewTeam({...newTeam, name: e.target.value})} className="builder-input" required />
            <input type="text" placeholder="College (Optional)" value={newTeam.collegeName} onChange={e=>setNewTeam({...newTeam, collegeName: e.target.value})} className="builder-input" />
            <button type="submit" className="btn-primary small">Add</button>
          </form>

          <div className="teams-list">
            {teams.map(t => (
              <div key={t.id} className="team-item">
                <div>
                  <strong>{t.name}</strong> <span style={{fontSize:'0.8rem', color:'#aaa'}}>{t.collegeName}</span>
                </div>
                <button onClick={() => handleDeleteTeam(t.id)} className="icon-btn-danger"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Matches Section */}
        <div className="tm-section glass-panel">
          <div className="section-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <h3><Trophy size={20}/> Fixtures ({matches.length})</h3>
            <button onClick={() => setIsMatchModalOpen(true)} className="btn-primary small" style={{display:'flex', gap:'5px', alignItems:'center'}}>
              <Plus size={16}/> New Match
            </button>
          </div>

          <div className="matches-list">
            {matches.map(m => (
              <div key={m.id} className="match-admin-item">
                <div className="match-admin-header">
                  <span>{m.round} • {m.status}</span>
                  <button onClick={() => handleDeleteMatch(m.id)} className="icon-btn-danger"><Trash2 size={14}/></button>
                </div>

                {editingMatchId === m.id ? (
                  <div className="score-editor">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px'}}>
                      <span style={{flex: 1}}>{m.teamAName}</span>
                      <input type="number" value={editScoreData.scoreA} onChange={e=>setEditScoreData({...editScoreData, scoreA: parseInt(e.target.value)})} style={{width:'50px', padding:'5px', textAlign:'center'}} />
                      <span style={{margin:'0 10px'}}>vs</span>
                      <input type="number" value={editScoreData.scoreB} onChange={e=>setEditScoreData({...editScoreData, scoreB: parseInt(e.target.value)})} style={{width:'50px', padding:'5px', textAlign:'center'}} />
                      <span style={{flex: 1, textAlign:'right'}}>{m.teamBName}</span>
                    </div>
                    <div style={{display:'flex', gap:'10px'}}>
                      <select value={editScoreData.status} onChange={e=>setEditScoreData({...editScoreData, status: e.target.value})} className="builder-input" style={{flex: 1, padding:'5px'}}>
                        <option value="Scheduled">Scheduled</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button onClick={() => handleSaveScore(m.id)} className="btn-primary small"><Save size={16}/></button>
                      <button onClick={() => setEditingMatchId(null)} className="btn-outline small">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="score-display">
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <strong style={{flex: 1}}>{m.teamAName}</strong>
                      <span style={{fontSize:'1.5rem', margin:'0 15px', color:'var(--accent-color)'}}>{m.scoreA} - {m.scoreB}</span>
                      <strong style={{flex: 1, textAlign:'right'}}>{m.teamBName}</strong>
                    </div>
                    <button onClick={() => { setEditingMatchId(m.id); setEditScoreData({ scoreA: m.scoreA, scoreB: m.scoreB, status: m.status }); }} className="btn-outline small" style={{marginTop:'10px', width:'100%'}}>
                      <Edit3 size={14} style={{marginRight:'5px'}}/> Update Score
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isMatchModalOpen && (
        <div className="modal-overlay" onClick={() => setIsMatchModalOpen(false)}>
          <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
            <h2>Create Fixture</h2>
            <form onSubmit={handleCreateMatch} className="modal-form">
              <div className="form-group">
                <label>Round</label>
                <input type="text" value={newMatch.round} onChange={e=>setNewMatch({...newMatch, round: e.target.value})} placeholder="e.g. Quarter-Final 1" required/>
              </div>
              <div className="form-group">
                <label>Team A</label>
                <select value={newMatch.teamA} onChange={e=>setNewMatch({...newMatch, teamA: e.target.value})} required className="builder-input">
                  <option value="">Select Team</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Team B</label>
                <select value={newMatch.teamB} onChange={e=>setNewMatch({...newMatch, teamB: e.target.value})} required className="builder-input">
                  <option value="">Select Team</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <button type="submit" className="btn-primary">Create Fixture</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTournamentManage;
