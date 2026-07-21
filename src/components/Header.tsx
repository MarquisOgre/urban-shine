import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, LogIn } from "lucide-react";
import MobileNav from "./MobileNav";

const Header = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 sm:space-x-4 hover:opacity-90 transition-opacity">
            <div className="bg-white rounded-full p-2 sm:p-3 flex items-center justify-center">
                <img
                  src="/Logo.png"
                  alt="Shine & Sparkle Logo"
                  className="h-14 w-auto sm:h-14 sm:w-auto object-contain"                />
            </div>
            <div className="flex flex-col justify-center">
              {/* <h1 className="text-lg sm:text-2xl font-bold">SHINE & SPARKLE</h1> */}
            </div>
          </Link>
          <nav className="hidden md:flex space-x-2 lg:space-x-4 items-center">
            {user && (
              <Link
                to="/invoice"
                className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
              >
                Invoice System
              </Link>
            )}
            <Link
              to="/formulations"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Formulations
            </Link>
            <Link
              to="/product-prices"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Product Prices
            </Link>
            <Link
              to="/indent-sheet"
              className="bg-white text-blue-600 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-blue-100 transition-colors text-sm lg:text-base"
            >
              Indent Sheet
            </Link>
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-400 text-slate-800 font-semibold py-2 px-3 lg:px-4 rounded-lg shadow hover:bg-yellow-300 transition-colors text-sm lg:text-base flex items-center gap-1"
              >
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            )}
          </nav>
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
