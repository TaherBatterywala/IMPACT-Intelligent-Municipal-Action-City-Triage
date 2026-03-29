import React from 'react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { FaUserTie, FaMapMarkedAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const KnowYourWard = () => {
    const { user } = useAuth();
    
    // Partially Dynamic Mock Data mixed with Live Profile Data
    const wardData = {
        wardNumber: user?.wardNumber || 42,
        wardName: user?.city || "Shivaji Nagar",
        population: "1.2 Lakh",
        corporator: {
            name: "Mr. Rajendra Sharma",
            party: "Independent",
            contact: "+91 98765 43210",
            email: "raj.sharma@impact.gov"
        },
        officer: {
            name: "Ms. Sunita Patil",
            designation: "Assistant Municipal Commissioner",
            contact: "+91 87654 32109",
            email: "ward42.amc@impact.gov"
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            
            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <FaMapMarkedAlt className="text-5xl text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Ward {wardData.wardNumber}: {wardData.wardName}</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Your Local Government Directory</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Corporator Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transform transition hover:scale-105 border-t-4 border-purple-500">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-full flex items-center justify-center text-2xl mr-4">
                                <FaUserTie />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{wardData.corporator.name}</h2>
                                <p className="text-purple-600 dark:text-purple-400 font-semibold">Elected Corporator</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="flex items-center"><FaPhoneAlt className="mr-3 text-gray-400" /> {wardData.corporator.contact}</p>
                            <p className="flex items-center"><FaEnvelope className="mr-3 text-gray-400" /> {wardData.corporator.email}</p>
                            <div className="pt-4 mt-4 border-t dark:border-gray-700 text-center">
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">Contact Corporator</Button>
                            </div>
                        </div>
                    </div>

                    {/* Officer Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transform transition hover:scale-105 border-t-4 border-blue-500">
                        <div className="flex items-center mb-6">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-2xl mr-4">
                                <FaUserTie />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{wardData.officer.name}</h2>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold">{wardData.officer.designation}</p>
                            </div>
                        </div>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="flex items-center"><FaPhoneAlt className="mr-3 text-gray-400" /> {wardData.officer.contact}</p>
                            <p className="flex items-center"><FaEnvelope className="mr-3 text-gray-400" /> {wardData.officer.email}</p>
                            <div className="pt-4 mt-4 border-t dark:border-gray-700 text-center">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">Message Officer</Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow text-center transition-colors">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Local Ward Map</h3>
                    <div className="w-full h-[400px] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center shadow-inner border border-gray-100 dark:border-gray-700">
                        <iframe 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }}
                            loading="lazy" 
                            allowFullScreen 
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(`${wardData.wardName} ${wardData.wardNumber}`)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KnowYourWard;
