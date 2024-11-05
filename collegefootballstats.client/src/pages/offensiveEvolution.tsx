import { useState } from "react";
import { Card, CardContent } from '../components/ui/card';
import NavigationHeader from '../components/ui/NavigationHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ConferenceStats {
  year: number;
  rushingYards: number;
  passingYards: number;
  totalPoints: number;
  yardsPerPlay: number;
  thirdDownConversion: number;
  redZoneEfficiency: number;
}

const ConferenceEvolution = () => {
  const [sliderValue, setSliderValue] = useState('2014');
  const [selectedConference, setSelectedConference] = useState('');
  const [statsType, setStatsType] = useState<'offensive' | 'defensive'>('offensive');
  const [conferenceStats, setConferenceStats] = useState<ConferenceStats[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const conferences = [
    "SEC", "Big Ten", "Big 12", "ACC", "Pac-12"
  ];

  const getSliderBackground = () => {
    const percentage = ((parseInt(sliderValue) - 2004) / (2024 - 2004)) * 100;
    return `linear-gradient(to right, var(--header-color) ${percentage}%, var(--gray-200) ${percentage}%)`;
  };

  const handleGenerateVisualization = async () => {
    if (!selectedConference) {
      alert('Please select a conference');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/conference-stats?conference=${selectedConference}&type=${statsType}&year=${sliderValue}`);
      const data = await response.json();
      setConferenceStats(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedConference('');
    setConferenceStats(null);
    setSliderValue('2014');
    setStatsType('offensive');
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

    if (!conferenceStats) {
      return (
        <div style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-600)'
        }}>
          Select a conference and generate visualization
        </div>
      );
    }

    return (
      <div style={{ height: '800px' }}>
        <div style={{ height: '380px', marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            {statsType === 'offensive' ? 'Offensive Metrics' : 'Defensive Metrics'} Over Time
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={conferenceStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rushingYards" 
                stroke="var(--header-color)" 
                name="Rushing Yards"
              />
              <Line 
                type="monotone" 
                dataKey="passingYards" 
                stroke="var(--button-primary)" 
                name="Passing Yards"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: '380px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Efficiency Metrics
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={conferenceStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="thirdDownConversion" 
                stroke="var(--header-color)" 
                name="3rd Down %"
              />
              <Line 
                type="monotone" 
                dataKey="redZoneEfficiency" 
                stroke="var(--button-primary)" 
                name="Red Zone %"
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
            Conference Clash:
          </h1>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '2rem',
            fontFamily: 'Georgia, serif',
            textAlign: 'center'
          }}>
            Offensive Evolution
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
                    name="stats-type"
                    checked={statsType === 'offensive'}
                    onChange={() => setStatsType('offensive')}
                    style={{ accentColor: 'var(--header-color)' }}
                  />
                  <span>Offensive</span>
                </label>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer'
                }}>
                  <input
                    type="radio"
                    name="stats-type"
                    checked={statsType === 'defensive'}
                    onChange={() => setStatsType('defensive')}
                    style={{ accentColor: 'var(--header-color)' }}
                  />
                  <span>Defensive</span>
                </label>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  Conference Selection
                </label>
                <select
                  value={selectedConference}
                  onChange={(e) => setSelectedConference(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-300)',
                    backgroundColor: 'white',
                    color: 'var(--text-primary)'
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

export default ConferenceEvolution;