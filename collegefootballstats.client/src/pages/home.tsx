import React from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Link } from 'react-router-dom';
import NavigationHeader from '../components/ui/NavigationHeader';

interface StatCardProps {
  title: string;
  description: string;
  imagePosition?: 'left' | 'right';
  path?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, description, imagePosition = 'left', path }) => {
  const cardContent = (
    <Card style={{
      margin: '1rem 0',
      display: 'flex',
      width: '100%',
      overflow: 'hidden',
      transition: 'box-shadow 0.2s ease',
      cursor: path ? 'pointer' : 'default'
    }}>
      {imagePosition === 'left' && (
        <div style={{
          width: '33.333%',
          backgroundColor: 'var(--gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{ color: 'var(--gray-600)' }}>Image Placeholder</div>
        </div>
      )}
      <CardContent style={{
        flex: 1,
        textAlign: imagePosition === 'right' ? 'right' : 'left'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '0.5rem'
        }}>{title}</h3>
        <p style={{
          color: 'var(--gray-600)',
          fontSize: '0.875rem'
        }}>{description}</p>
      </CardContent>
      {imagePosition === 'right' && (
        <div style={{
          width: '33.333%',
          backgroundColor: 'var(--gray-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{ color: 'var(--gray-600)' }}>Image Placeholder</div>
        </div>
      )}
    </Card>
  );

  return path ? (
    <Link to={path} style={{ textDecoration: 'none' }}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};

const HomePage: React.FC = () => {
  const stats = [
    {
      title: "Game Changers: Player Impact Analysis",
      description: "For the query about individual player performance influencing team success",
      imagePosition: "left" as const,
      path: "/player-impact"
    },
    {
      title: "Star Power: Recruits to Pros",
      description: "For the query about recruiting class ratings and NFL draft outcomes",
      imagePosition: "right" as const,
      path: "/recruits-to-pros"
    },
    {
      title: "Conference Clash: Offensive Evolution",
      description: "For the query about how offensive and defensive metrics have evolved within conferences",
      imagePosition: "left" as const,
      path: "/offensive-evolution"
    },
    {
      title: "Sideline Shuffle: Coaching Impact",
      description: "For the query about how coaching changes affect team performance",
      imagePosition: "right" as const,
      path: "/coaching-impact"
    },
    {
      title: "Draft Day Dividends: Position Performance",
      description: "For the query about player performance metrics and their effect on NFL draft rounds",
      imagePosition: "left" as const,
      path: "/draft-metrics"
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--gray-50)' }}>
      <NavigationHeader />

      <main style={{
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            color: 'var(--text-primary)',
            marginBottom: '1rem'
          }}>
            Your GO-TO hub for College Football Stat analysis and visualization
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              description={stat.description}
              imagePosition={stat.imagePosition}
              path={stat.path}
            />
          ))}
        </div>

        <Card style={{ marginTop: '2rem' }}>
          <CardContent style={{ textAlign: 'center' }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: 'var(--text-primary)'
            }}>
              Shows all of the tuples found within our database
            </h3>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              <button style={{
                backgroundColor: 'var(--button-primary)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                transition: 'background-color 0.2s ease'
              }}>
                Show Total Tuples
              </button>
              <div style={{
                padding: '0.5rem 1rem',
                border: '1px solid var(--gray-300)',
                borderRadius: '0.375rem'
              }}>
                Tuples here
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default HomePage;