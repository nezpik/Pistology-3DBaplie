import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BaplieVisualizer from './pages/BaplieVisualizer';
import ContainerLocation from './pages/ContainerLocation';
import ContainerHistory from './pages/ContainerHistory';
import DamageReport from './pages/DamageReport';
import EdiHub from './pages/EdiHub';
import CustomsInspection from './pages/CustomsInspection';
import TaskDashboard from './pages/TaskDashboard';
import TruckAppointmentSystem from './pages/TruckAppointmentSystem';
import TruckingCompanyView from './pages/TruckingCompanyView';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="p-4 bg-gray-800 text-white">
          <Link to="/" className="mr-4">BAPLIE Visualizer</Link>
          <Link to="/location/TEST-CONTAINER" className="mr-4">Container Location</Link>
          <Link to="/history/TEST-CONTAINER" className="mr-4">Container History</Link>
          <Link to="/damage/TEST-CONTAINER" className="mr-4">Damage Reports</Link>
          <Link to="/edi/TEST-CONTAINER" className="mr-4">EDI Hub</Link>
          <Link to="/customs/TEST-CONTAINER" className="mr-4">Customs Inspections</Link>
          <Link to="/tasks" className="mr-4">Task Dashboard</Link>
          <Link to="/tas" className="mr-4">TAS</Link>
          <Link to="/tas/TRUCKING-COMPANY-A">TAS (Company View)</Link>
        </nav>
        <Routes>
          <Route path="/" element={<BaplieVisualizer />} />
          <Route path="/location/:containerId" element={<ContainerLocation />} />
          <Route path="/history/:containerId" element={<ContainerHistory />} />
          <Route path="/damage/:containerId" element={<DamageReport />} />
          <Route path="/edi/:containerId" element={<EdiHub />} />
          <Route path="/customs/:containerId" element={<CustomsInspection />} />
          <Route path="/tasks" element={<TaskDashboard />} />
          <Route path="/tas" element={<TruckAppointmentSystem />} />
          <Route path="/tas/:companyName" element={<TruckingCompanyView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
