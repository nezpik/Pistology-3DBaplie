import { Link, NavLink } from 'react-router-dom';
import {
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
    const navLinkClasses = "flex items-center py-2 px-4 rounded hover:bg-primary-700";
    const activeNavLinkClasses = "bg-primary-700";

  return (
    <div className="w-64 h-screen bg-primary-900 text-white flex flex-col">
      <div className="p-4 border-b border-primary-700">
        <Link to="/" className="text-2xl font-bold tracking-wider">
            <span className="text-primary-400">T</span>erminal<span className="text-primary-400">OS</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink to="/tasks" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
            <FaTasks className="mr-3" /> Task Dashboard
        </NavLink>
        <NavLink to="/location/TEST-CONTAINER" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaMapMarkerAlt className="mr-3" /> Container Location
        </NavLink>
        <NavLink to="/history/TEST-CONTAINER" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaHistory className="mr-3" /> Container History
        </NavLink>
        <NavLink to="/damage/TEST-CONTAINER" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaExclamationTriangle className="mr-3" /> Damage Reports
        </NavLink>
        <NavLink to="/edi/TEST-CONTAINER" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaFileAlt className="mr-3" /> EDI Hub
        </NavLink>
        <NavLink to="/customs/TEST-CONTAINER" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaCheckSquare className="mr-3" /> Customs Inspections
        </NavLink>
        <NavLink to="/tas" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaTruck className="mr-3" /> TAS
        </NavLink>
        <NavLink to="/tas/TRUCKING-COMPANY-A" className={({ isActive }) => `${navLinkClasses} ${isActive ? activeNavLinkClasses : ''}`}>
          <FaBuilding className="mr-3" /> TAS (Company View)
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
