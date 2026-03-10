import { Link } from 'react-router-dom';
import { FaCircleInfo, FaSun } from "react-icons/fa6"; 

function Navbar() {
    return (
        <nav className="fixed top-0 left-0 w-full z-[100] flex justify-between items-center px-10 py-4 backdrop-blur-md bg-black/10 border-b border-white/10 text-white">
            <div className="font-bold text-xl tracking-tighter">LUMINA</div>
            
            <div className="flex gap-8 items-center font-medium text-sm">
                <Link to="/" className="hover:text-white/70 transition-colors flex items-center">
                    <FaCircleInfo size={20} /> 
                </Link>
                <Link to="/DashboardScreen" className="hover:text-white/70 transition-colors">
                    <FaSun size={20} /> 
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;