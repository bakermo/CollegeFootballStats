import { useState } from "react";
import { Card, CardContent } from '../components/ui/card';
import NavigationHeader from '../components/ui/NavigationHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface DraftData {
  year: number;
  round: number;
  totalPicks: number;
  averageRound: number;
  positions: Record<string, number>;
}

interface ConferenceData {
  year: number;
  totalDrafted: number;
  averageRound: number;
  totalTeams: number;
  conferenceRank: number;
}

const RecruitsToProsList = () => {
  const [selectionType, setSelectionType] = useState<'team' | 'conference'>('team');
  const [sliderValue, setSliderValue] = useState('2014');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedConference, setSelectedConference] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [draftData, setDraftData] = useState<DraftData[] | null>(null);
  const [conferenceData, setConferenceData] = useState<ConferenceData[] | null>(null);

  const teams = [
    "Alabama", "Georgia", "Ohio State", "Michigan", "Texas"
  ];

  const conferences = [
    "SEC", "Big Ten", "Big 12", "ACC", "Pac-12"
  ];

  const getSliderBackground = () => {
    const percentage = ((parseInt(sliderValue) - 2004) / (2024 - 2004)) * 100;
    return `linear-gradient(to right, #4F46E5 ${percentage}%, #E5E7EB ${percentage}%)`;
  };

  const handleGenerateVisualization = async () => {
    if ((selectionType === 'team' && !selectedTeam) || 
        (selectionType === 'conference' && !selectedConference)) {
      alert('Please make a selection first');
      return;
    }

    setIsLoading(true);
    try {
      if (selectionType === 'team') {
        const response = await fetch(`/api/draft-analysis/team?team=${selectedTeam}&year=${sliderValue}`);
        const data = await response.json();
        setDraftData(data);
        setConferenceData(null);
      } else {
        const response = await fetch(`/api/draft-analysis/conference?conference=${selectedConference}&year=${sliderValue}`);
        const data = await response.json();
        setConferenceData(data);
        setDraftData(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTeam('');
    setSelectedConference('');
    setDraftData(null);
    setConferenceData(null);
    setSliderValue('2014');
    setSelectionType('team');
  };

  const renderVisualization = () => {
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          Loading...
        </div>
      );
    }

    if (draftData) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={draftData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="totalPicks" stroke="#4F46E5" name="Total Draft Picks" />
            <Line type="monotone" dataKey="averageRound" stroke="#818CF8" name="Average Round" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (conferenceData) {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={conferenceData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalDrafted" fill="#4F46E5" name="Players Drafted" />
            <Bar dataKey="conferenceRank" fill="#818CF8" name="Conference Rank" />
          </BarChart>
        </ResponsiveContainer>
      );
    }

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        Select options and generate visualization
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F7FB' }}>
      <NavigationHeader />

      <main style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 2rem'
      }}>
        <div style={{
          marginBottom: '2rem',
          color: 'var(--text-primary)'
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            fontFamily: 'Georgia, serif',
            textAlign: 'center'
          }}>
            Star Power:
          </h1>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '2rem',
            fontFamily: 'Georgia, serif',
            textAlign: 'center'
          }}>
            Recruit to Pros
          </h2>
        </div>
        
        <Card>
          <CardContent style={{ padding: '2rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: '#1e1b4b',
              marginBottom: '2rem'
            }}>
              Select the range of seasons to visualize
            </h2>

            <div style={{ marginBottom: '2rem' }}>
              <input 
                type="range"
                min="2004"
                max="2024"
                value={sliderValue}
                onChange={(e) => setSliderValue(e.target.value)}
                style={{
                  width: '100%',
                  height: '2px',
                  background: getSliderBackground(),
                  appearance: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  borderRadius: '2px'
                }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                color: 'var(--gray-600)',
                fontSize: '0.875rem',
                marginTop: '0.5rem'
              }}>
                <span>04'</span>
                <span>24'</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                gap: '2rem',
                marginBottom: '1rem'
              }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="selection-type"
                    checked={selectionType === 'team'}
                    onChange={() => setSelectionType('team')}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>Team</span>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="selection-type"
                    checked={selectionType === 'conference'}
                    onChange={() => setSelectionType('conference')}
                    style={{ accentColor: '#4F46E5' }}
                  />
                  <span>Conference</span>
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#1e1b4b'
                }}>
                  Select Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  disabled={selectionType !== 'team'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-300)',
                    backgroundColor: selectionType !== 'team' ? 'var(--gray-100)' : 'white',
                    color: selectionType !== 'team' ? 'var(--gray-600)' : 'var(--text-primary)',
                    cursor: selectionType !== 'team' ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">Select a team...</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: '#1e1b4b'
                }}>
                  Select Conference
                </label>
                <select
                  value={selectedConference}
                  onChange={(e) => setSelectedConference(e.target.value)}
                  disabled={selectionType !== 'conference'}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-300)',
                    backgroundColor: selectionType !== 'conference' ? 'var(--gray-100)' : 'white',
                    color: selectionType !== 'conference' ? 'var(--gray-600)' : 'var(--text-primary)',
                    cursor: selectionType !== 'conference' ? 'not-allowed' : 'pointer'
                  }}
                >
                  <option value="">Select a conference...</option>
                  {conferences.map(conference => (
                    <option key={conference} value={conference}>{conference}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button 
                onClick={handleGenerateVisualization}
                disabled={isLoading}
                style={{
                  backgroundColor: '#1e1b4b',
                  color: 'white',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  opacity: isLoading ? 0.7 : 1
                }}
              >
                {isLoading ? 'Generating...' : 'Generate Visualization'}
              </button>
              <button 
                onClick={handleReset}
                style={{
                  backgroundColor: 'white',
                  color: 'var(--text-primary)',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--gray-300)',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Reset
              </button>
            </div>

            <div style={{
              marginTop: '2rem',
              backgroundColor: 'var(--gray-100)',
              borderRadius: '0.5rem',
              height: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--gray-600)',
              padding: '1rem'
            }}>
              {renderVisualization()}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default RecruitsToProsList;