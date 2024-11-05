import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import PlayerImpact from './pages/playerImpact';
import RecruitToPro from './pages/recruitToPro';
import OffensiveEvolution from './pages/offensiveEvolution';
import CoachingImpact from './pages/coachingImpact';
import DraftMetrics from './pages/draftMetrics';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player-impact" element={<PlayerImpact />} />
        <Route path="/recruits-to-pros" element={<RecruitToPro />} />
        <Route path="/offensive-evolution" element={<OffensiveEvolution />} />
        <Route path="/coaching-impact" element={<CoachingImpact />} />
        <Route path="/draft-metrics" element={<DraftMetrics />} />
      </Routes>
    </Router>
  );
}

export default App;