import { Link } from 'react-router-dom';
import {
  FaCube,
  FaMapMarkerAlt,
  FaHistory,
  FaExclamationTriangle,
  FaFileAlt,
  FaCheckSquare,
  FaTasks,
  FaTruck,
  FaBuilding
} from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold">TOS</h1>
      </div>
      <nav className="flex-1 p-4">
        <Link to="/" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaCube className="mr-3" /> BAPLIE Visualizer
        </Link>
        <Link to="/location/TEST-CONTAINER" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaMapMarkerAlt className="mr-3" /> Container Location
        </Link>
        <Link to="/history/TEST-CONTAINER" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaHistory className="mr-3" /> Container History
        </Link>
        <Link to="/damage/TEST-CONTAINER" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaExclamationTriangle className="mr-3" /> Damage Reports
        </Link>
        <Link to="/edi/TEST-CONTAINER" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaFileAlt className="mr-3" /> EDI Hub
        </Link>
        <Link to="/customs/TEST-CONTAINER" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaCheckSquare className="mr-3" /> Customs Inspections
        </Link>
        <Link to="/tasks" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaTasks className="mr-3" /> Task Dashboard
        </Link>
        <Link to="/tas" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaTruck className="mr-3" /> TAS
        </Link>
        <Link to="/tas/TRUCKING-COMPANY-A" className="flex items-center py-2 px-4 rounded hover:bg-gray-700">
          <FaBuilding className="mr-3" /> TAS (Company View)
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
