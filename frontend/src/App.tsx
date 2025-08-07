import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaplieVisualizer from './pages/BaplieVisualizer';
import ContainerLocation from './pages/ContainerLocation';
import ContainerHistory from './pages/ContainerHistory';
import DamageReport from './pages/DamageReport';
import EdiHub from './pages/EdiHub';
import CustomsInspection from './pages/CustomsInspection';
import TaskDashboard from './pages/TaskDashboard';
import TruckAppointmentSystem from './pages/TruckAppointmentSystem';
import TruckingCompanyView from './pages/TruckingCompanyView';
import Sidebar from './components/Sidebar';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
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
        </main>
      </div>
    </Router>
  );
}

export default App;
