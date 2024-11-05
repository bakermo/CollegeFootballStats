import { useState } from "react";
import { Card, CardContent } from '../components/ui/card';
import NavigationHeader from '../components/ui/NavigationHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface CoachingStats {
  year: number;
  wins: number;
  losses: number;
  winPercentage: number;
  conferenceWins: number;
  conferenceLosses: number;
  bowlGames: boolean;
  bowlResult?: string;
}

interface CoachingTrend {
  year: number;
  previousWins: number;
  currentWins: number;
  recruitingRank?: number;
  totalDraftPicks?: number;
}

const CoachingImpact = () => {
  const [sliderValue, setSliderValue] = useState('2014');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedCoach, setSelectedCoach] = useState('');
  const [coachingStats, setCoachingStats] = useState<CoachingStats[] | null>(null);
  const [coachingTrends, setCoachingTrends] = useState<CoachingTrend[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - should come from backend
  const teams = [
    "Alabama", "Georgia", "Ohio State", "Michigan", "Texas"
  ];

  // Mock data - should be populated based on selected team
  const coaches = [
    "Nick Saban", "Kirby Smart", "Ryan Day", "Jim Harbaugh", "Steve Sarkisian"
  ];

  const getSliderBackground = () => {
    const percentage = ((parseInt(sliderValue) - 2004) / (2024 - 2004)) * 100;
    return `linear-gradient(to right, var(--header-color) ${percentage}%, var(--gray-200) ${percentage}%)`;
  };

  const handleGenerateVisualization = async () => {
    if (!selectedTeam || !selectedCoach) {
      alert('Please select both a team and a coach');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch coaching stats
      const statsResponse = await fetch(`/api/coaching-stats?team=${selectedTeam}&coach=${selectedCoach}&year=${sliderValue}`);
      const statsData = await statsResponse.json();
      setCoachingStats(statsData);

      // Fetch coaching trends (comparison with previous coach)
      const trendsResponse = await fetch(`/api/coaching-trends?team=${selectedTeam}&coach=${selectedCoach}&year=${sliderValue}`);
      const trendsData = await trendsResponse.json();
      setCoachingTrends(trendsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedTeam('');
    setSelectedCoach('');
    setCoachingStats(null);
    setCoachingTrends(null);
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

    if (!coachingStats || !coachingTrends) {
      return (
        <div style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-600)'
        }}>
          Select a team and coach, then generate visualization
        </div>
      );
    }

    return (
      <div style={{ height: '800px' }}>
        {/* Win-Loss Record Chart */}
        <div style={{ height: '380px', marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Season Performance
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={coachingStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wins" fill="var(--header-color)" name="Wins" />
              <Bar dataKey="losses" fill="var(--gray-300)" name="Losses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Program Trends Chart */}
        <div style={{ height: '380px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Program Impact Trends
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={coachingTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="currentWins" 
                stroke="var(--header-color)" 
                name="Current Coach Wins"
              />
              <Line 
                type="monotone" 
                dataKey="previousWins" 
                stroke="var(--gray-600)" 
                name="Previous Coach Wins"
                strokeDasharray="5 5"
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
            Sideline Shuffle:
          </h1>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '2rem',
            fontFamily: 'Georgia, serif',
            textAlign: 'center'
          }}>
            Coaching Impact
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
                    color: 'var(--text-primary)',
                    marginBottom: '1rem'
                  }}
                >
                  <option value="">Select a team...</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              {/* Coach Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  Select Coach
                </label>
                <select
                  value={selectedCoach}
                  onChange={(e) => setSelectedCoach(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-300)',
                    backgroundColor: 'white',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select a coach...</option>
                  {coaches.map(coach => (
                    <option key={coach} value={coach}>{coach}</option>
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

export default CoachingImpact;