import { Routes, Route } from 'react-router-dom';
import Intro from './Intro';
import DashboardScreen from './components/dashboardScreen/DashboardScreen';
import Navbar from './components/navbar/Navbar';
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