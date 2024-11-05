import { useState } from "react";
import { Card, CardContent } from '../components/ui/card';
import NavigationHeader from '../components/ui/NavigationHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Backend boys can edit this how they please, this was a quick mockup
interface PlayerGameData {
  game: number;
  statValue: number;
  statType: string;
  statCategory: string;
  opponent?: string;
  date?: string;
  result?: string;
}

// Backend boys can edit this how they please, this was a quick mockup
interface TeamPerformanceData {
  game: number;
  teamStatValue: number;
  opponentStatValue: number;
  margin: number;
  date: string;
  opponent: string;
}

const PlayerImpactAnalysis = () => {
  const [sliderValue, setSliderValue] = useState('2014');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [playerStats, setPlayerStats] = useState<PlayerGameData[] | null>(null);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformanceData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data - should come from backend
  const players = [
    "Bryce Young", "Stetson Bennett", "C.J. Stroud", "Caleb Williams", "Drake Maye"
  ];
  
  // Mock data - should come from backend
  const teams = [
    "Alabama", "Georgia", "Ohio State", "Michigan", "Texas"
  ];

  // Calculate slider background
  const getSliderBackground = () => {
    const percentage = ((parseInt(sliderValue) - 2004) / (2024 - 2004)) * 100;
    return `linear-gradient(to right, var(--header-color) ${percentage}%, var(--gray-200) ${percentage}%)`;
  };

  const handleGenerateVisualization = async () => {
    if (!selectedPlayer || !selectedTeam) {
      alert('Please select both a player and a team');
      return;
    }

    setIsLoading(true);
    try {
      // BACKEND API CALLS START
      // These API endpoints need to be implemented by the backend boys
      const statsResponse = await fetch(`/api/player-stats?player=${selectedPlayer}&team=${selectedTeam}&season=${sliderValue}`);
      const playerData = await statsResponse.json();
      setPlayerStats(playerData);

      const teamResponse = await fetch(`/api/team-impact?player=${selectedPlayer}&team=${selectedTeam}&season=${sliderValue}`);
      const teamData = await teamResponse.json();
      setTeamPerformance(teamData);
      // BACKEND API CALLS END
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedPlayer('');
    setSelectedTeam('');
    setPlayerStats(null);
    setTeamPerformance(null);
    setSliderValue('2014');
  };

  const renderVisualization = () => {
    if (isLoading) {
      return (
        <div style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-600)'
        }}>
          Loading...
        </div>
      );
    }

    if (!playerStats || !teamPerformance) {
      return (
        <div style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-600)'
        }}>
          Select a player and team, then generate visualization
        </div>
      );
    }

    return (
      <div style={{ height: '800px' }}>
        {/* Player Performance Chart */}
        <div style={{ height: '380px', marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Player Performance Over Time
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={playerStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="game" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="statValue" 
                stroke="var(--header-color)" 
                name="Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Team Performance Chart */}
        <div style={{ height: '380px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Team Performance Impact
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={teamPerformance}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="game" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="teamStatValue" 
                stroke="var(--button-primary)" 
                name="Team Performance"
              />
              <Line 
                type="monotone" 
                dataKey="opponentStatValue" 
                stroke="var(--gray-600)" 
                name="Opponent Performance"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <NavigationHeader />

      <main style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 2rem'
      }}>
        {/* Title Section */}
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
            Game Changers
          </h1>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '2rem',
            fontFamily: 'Georgia, serif',
            textAlign: 'center'
          }}>
            Player Impact Analysis
          </h2>
        </div>

        <Card>
          <CardContent style={{ padding: '2rem' }}>
            <h2 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '2rem'
            }}>
              Select the range of seasons to visualize
            </h2>

            {/* Range Slider */}
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

            {/* Selection Controls */}
            <div style={{ marginBottom: '1.5rem' }}>
              {/* Player Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  Select Player
                </label>
                <select 
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-300)',
                    backgroundColor: 'white',
                    color: 'var(--text-primary)',
                    marginBottom: '1rem'
                  }}
                >
                  <option value="">Select a player...</option>
                  {players.map(player => (
                    <option key={player} value={player}>{player}</option>
                  ))}
                </select>
              </div>

              {/* Team Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  Select Team
                </label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-300)',
                    backgroundColor: 'white',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select a team...</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              <button 
                onClick={handleGenerateVisualization}
                disabled={isLoading}
                style={{
                  backgroundColor: 'var(--button-primary)',
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

            {/* Visualization Area */}
            <div style={{
              marginTop: '2rem',
              backgroundColor: 'var(--gray-100)',
              borderRadius: '0.5rem',
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

export default PlayerImpactAnalysis;