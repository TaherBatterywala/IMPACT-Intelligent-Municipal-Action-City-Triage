import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBell, FaBars, FaSun, FaMoon } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from './Button';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md w-full sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to={user?.role === 'officer' ? "/officer/dashboard" : "/"} className="text-2xl font-bold text-primary">IMPACT</Link>
                        
                        {/* Language Switcher Container */}
                        <div className="ml-4 flex items-center shrink-0">
                            <LanguageSwitcher />
                        </div>

                        {/* Theme Toggle Container */}
                        <div className="ml-4 flex items-center shrink-0 text-xl border-l pl-4 dark:border-gray-600">
                            <button onClick={toggleTheme} className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-yellow-400 transition-colors">
                                {theme === 'dark' ? <FaSun /> : <FaMoon />}
                            </button>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-700 dark:text-gray-300">Welcome, {user.name}</span>
                                <div className="relative group">
                                    <button className="text-gray-600 hover:text-primary">
                                        <FaUserCircle size={28} />
                                    </button>
                                    <div className="absolute right-0 w-48 bg-white shadow-lg rounded-md hidden group-hover:block py-2">
                                        <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login"><Button variant="ghost">Login</Button></Link>
                                <Link to="/officer/login"><Button variant="outline">Officer Login</Button></Link>
                            </>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                            <FaBars size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {user ? (
                            <>
                                <div className="block px-3 py-2 text-primary font-medium">{user.name}</div>
                                <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Profile</Link>
                                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-gray-50">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Citizen Login</Link>
                                <Link to="/officer/login" className="block px-3 py-2 text-gray-700 hover:bg-gray-50">Officer Login</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
