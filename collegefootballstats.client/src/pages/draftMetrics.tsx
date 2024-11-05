import { useState } from "react";
import { Card, CardContent } from '../components/ui/card';
import NavigationHeader from '../components/ui/NavigationHeader';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface PositionDraftStats {
  year: number;
  totalDrafted: number;
  averageRound: number;
  firstRoundPicks: number;
  topTenPicks: number;
  averagePick: number;
  nflTeamDistribution: Record<string, number>;
}

interface PositionPerformanceData {
  year: number;
  statCategory: string;
  averageValue: number;
  topPerformer: string;
  topPerformanceValue: number;
}

const DraftMetrics = () => {
  const [sliderValue, setSliderValue] = useState('2014');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [draftStats, setDraftStats] = useState<PositionDraftStats[] | null>(null);
  const [performanceData, setPerformanceData] = useState<PositionPerformanceData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - should come from backend
  const positions = [
    "QB", "RB", "WR", "TE", "OL", "DL", "LB", "DB", "K", "P"
  ];

  const getSliderBackground = () => {
    const percentage = ((parseInt(sliderValue) - 2004) / (2024 - 2004)) * 100;
    return `linear-gradient(to right, var(--header-color) ${percentage}%, var(--gray-200) ${percentage}%)`;
  };

  const handleGenerateVisualization = async () => {
    if (!selectedPosition) {
      alert('Please select a position');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch draft statistics
      const statsResponse = await fetch(`/api/position-draft-stats?position=${selectedPosition}&year=${sliderValue}`);
      const statsData = await statsResponse.json();
      setDraftStats(statsData);

      // Fetch performance metrics
      const performanceResponse = await fetch(`/api/position-performance?position=${selectedPosition}&year=${sliderValue}`);
      const performanceData = await performanceResponse.json();
      setPerformanceData(performanceData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedPosition('');
    setDraftStats(null);
    setPerformanceData(null);
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

    if (!draftStats || !performanceData) {
      return (
        <div style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gray-600)'
        }}>
          Select a position and generate visualization
        </div>
      );
    }

    return (
      <div style={{ height: '800px' }}>
        {/* Draft Trends Chart */}
        <div style={{ height: '380px', marginBottom: '2rem' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Draft Position Trends
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={draftStats}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalDrafted" 
                stroke="var(--header-color)" 
                name="Players Drafted"
              />
              <Line 
                type="monotone" 
                dataKey="averageRound" 
                stroke="var(--button-primary)" 
                name="Average Round"
              />
              <Line 
                type="monotone" 
                dataKey="firstRoundPicks" 
                stroke="var(--gray-600)" 
                name="First Round Picks"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Metrics Chart */}
        <div style={{ height: '380px' }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Position Performance Metrics
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageValue" fill="var(--header-color)" name="Average Performance" />
              <Bar dataKey="topPerformanceValue" fill="var(--button-primary)" name="Top Performance" />
            </BarChart>
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
            Draft Day Dividends:
          </h1>
          <h2 style={{
            fontSize: '1.8rem',
            marginBottom: '2rem',
            fontFamily: 'Georgia, serif',
            textAlign: 'center'
          }}>
            Position Performance
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
              {/* Position Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)'
                }}>
                  Player Position
                </label>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--gray-300)',
                    backgroundColor: 'white',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="">Select a position...</option>
                  {positions.map(position => (
                    <option key={position} value={position}>{position}</option>
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

export default DraftMetrics;