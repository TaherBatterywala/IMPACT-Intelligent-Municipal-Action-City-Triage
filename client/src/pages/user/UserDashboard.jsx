import React from 'react';
import { FaEdit, FaClipboardList, FaFileInvoiceDollar, FaBus, FaInfoCircle, FaPhoneAlt } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import NewsSlider from '../../components/user/NewsSlider';
import ServiceCard from '../../components/user/ServiceCard';
import { useAuth } from '../../context/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Hello, {user?.name || 'Citizen'} 👋</h1>
                    <p className="text-gray-600 dark:text-gray-400">What would you like to do today?</p>
                </div>

                <NewsSlider />

                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">City Services</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                    <ServiceCard
                        icon={FaEdit}
                        title="File Complaint"
                        link="/file-complaint"
                        color="border-red-500"
                    />
                    <ServiceCard
                        icon={FaClipboardList}
                        title="Track Status"
                        link="/status"
                        color="border-blue-500"
                    />
                    <ServiceCard
                        icon={FaFileInvoiceDollar}
                        title="Traffic Challan"
                        link="/challan"
                        color="border-yellow-500"
                    />
                    <ServiceCard
                        icon={FaBus}
                        title="Bus Tickets"
                        link="/bus"
                        color="border-green-500"
                    />
                    <ServiceCard
                        icon={FaInfoCircle}
                        title="Know Your Ward"
                        link="/ward"
                        color="border-purple-500"
                    />
                    <ServiceCard
                        icon={FaPhoneAlt}
                        title="Emergency"
                        link="/emergency"
                        color="border-orange-500"
                    />
                </div>

                {/* Additional Sections can go here */}
            </main>
        </div>
    );
};

export default UserDashboard;
