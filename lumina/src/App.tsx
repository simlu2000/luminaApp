import { Routes, Route } from 'react-router-dom';
import Intro from './Intro';
import DashboardScreen from './components/dashboardScreen/DashboardScreen';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/DashboardScreen" element={<DashboardScreen />} />
    </Routes>
  );
}

export default App;