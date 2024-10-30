import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link } from 'react-router-dom';

const RecruitsToProsList = () => {
  const [selectionType, setSelectionType] = useState<'team' | 'conference'>('team');

  // Sample data - replace with your actual data
  const teams = [
    "Alabama", "Georgia", "Ohio State", "Michigan", "Texas"
  ];
  
  const conferences = [
    "SEC", "Big Ten", "Big 12", "ACC", "Pac-12"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header style={{ backgroundColor: '#b5500c' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white hover:text-white/80">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Star Power: Recruits to Pros</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          {/* Season Range Selector */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#1c1c84' }}>
              Select the range of seasons to visualize
            </h2>
            <input 
              type="range"
              className="w-full"
              min="2004"
              max="2024"
              defaultValue="2014"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>04'</span>
              <span>24'</span>
            </div>
          </div>

          {/* Team/Conference Selection */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="selection-type" 
                  className="text-indigo-600" 
                  checked={selectionType === 'team'}
                  onChange={() => setSelectionType('team')}
                />
                <span>Team</span>
              </label>
              <label className="flex items-center gap-2">
                <input 
                  type="radio" 
                  name="selection-type" 
                  className="text-indigo-600"
                  checked={selectionType === 'conference'}
                  onChange={() => setSelectionType('conference')}
                />
                <span>Conference</span>
              </label>
            </div>
            
            {/* Dropdowns */}
            <div className="space-y-3">
              {/* Team Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Team
                </label>
                <select 
                  className={`w-full p-2 border rounded-md ${
                    selectionType !== 'team' 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-white'
                  }`}
                  disabled={selectionType !== 'team'}
                >
                  <option value="">Select a team...</option>
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
              </div>

              {/* Conference Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Conference
                </label>
                <select 
                  className={`w-full p-2 border rounded-md ${
                    selectionType !== 'conference' 
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                      : 'bg-white'
                  }`}
                  disabled={selectionType !== 'conference'}
                >
                  <option value="">Select a conference...</option>
                  {conferences.map(conference => (
                    <option key={conference} value={conference}>{conference}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              className="px-4 py-2 rounded-md text-white"
              style={{ backgroundColor: '#1c1c84' }}
            >
              Generate Visualization
            </button>
            <button 
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
            >
              Reset
            </button>
          </div>

          {/* Placeholder for Visualization */}
          <div className="mt-8 bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            <span className="text-gray-400">Visualization will appear here</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecruitsToProsList;