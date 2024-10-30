import { Menu } from "lucide-react";
import { Link } from 'react-router-dom';

interface AnalysisCard {
  title: string;
  description: string;
  id: string;
  path: string;
}

const HomePage = () => {
  const analysisCards: AnalysisCard[] = [
    {
      title: "Game Changers: Player Impact Analysis",
      description: "For the query about individual player performance influencing team success",
      id: "player-impact",
      path: "/player-impact"
    },
    {
      title: "Star Power: Recruits to Pros",
      description: "For the query about recruiting class ratings and NFL draft outcomes",
      id: "recruits-pros",
      path: "/recruits-to-pros"
    },
    {
      title: "Conference Clash: Offensive Evolution",
      description: "For the query about how offensive and defensive metrics have evolved within conferences",
      id: "conference-evolution",
      path: "/conference-evolution"
    },
    {
      title: "Sideline Shuffle: Coaching Impact",
      description: "For the query about how coaching changes affect team performance",
      id: "coaching-impact",
      path: "/coaching-impact"
    },
    {
      title: "Draft Day Dividends: Position Performance",
      description: "For the query about player performance metrics and their effect on NFL draft rounds",
      id: "draft-metrics",
      path: "/draft-metrics"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header style={{ backgroundColor: '#b5500c' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">College Football Stat Hub</h1>
          <div className="flex items-center gap-4">
            <Link 
              to="/teams" 
              className="text-white hover:bg-white/20 transition-colors px-4 py-2 rounded-lg"
            >
              View Teams
            </Link>
            <button 
              className="p-2 text-white hover:bg-white/20 transition-colors rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Analysis Cards */}
        <div className="space-y-4">
          {analysisCards.map((card) => (
            <Link 
              key={card.id}
              to={card.path}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-sm p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200">
                <div className="flex items-center gap-6">
                  {['player-impact', 'conference-evolution', 'draft-metrics'].includes(card.id) ? (
                    <>
                      <div className="w-1/3 aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Image Placeholder</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1" style={{ color: '#1c1c84' }}>{card.title}</h3>
                        <p className="text-gray-600">{card.description}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1" style={{ color: '#1c1c84' }}>{card.title}</h3>
                        <p className="text-gray-600">{card.description}</p>
                      </div>
                      <div className="w-1/3 aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">Image Placeholder</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Database Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-8 p-6">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-medium mb-4">Shows all of the tuples found within our database</h3>
            <div className="flex gap-4 items-center">
              <button 
                className="text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#0e3b4f' }}
              >
                Show Total Tuples
              </button>
              <div className="border rounded-md px-4 py-2">
                Tuples here
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;