import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Shuhada from './pages/Shuhada';
import History from './pages/History';
import Achievements from './pages/Achievements';
import AchievementDetail from './pages/AchievementDetail';
import Summaries from './pages/Summaries';
import ShuhadaDetail from './pages/ShuhadaDetail';
import PictorialGlimpses from './pages/PictorialGlimpses';

function App() {
  const backgroundStyle = {
    position: 'relative',
    backgroundColor: '#07361b', // Dark army green background
  };

  return (
    <Router>
      <div className="App" style={backgroundStyle}>
        <div className="background-overlay"></div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shuhada" element={<Shuhada />} />
          <Route path="/shuhada/:id" element={<ShuhadaDetail />} />
          <Route path="/history" element={<History />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/achievements/:id" element={<AchievementDetail />} />
          <Route path="/summaries" element={<Summaries />} />
          <Route path="/pictorial-glimpses" element={<PictorialGlimpses />} />
          {/* Additional routes will be added as screens are developed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
