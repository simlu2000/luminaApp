import { Routes, Route } from 'react-router-dom';
import Intro from './Intro';

import DashboardScreen from './components/DashboardScreen/DashboardScreen';
import Navbar from './components/Navbar/Navbar';
function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/DashboardScreen" element={<DashboardScreen />} />
      </Routes>
    </>
  );
}

export default App;
