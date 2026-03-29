import React from 'react';
import Navbar from '../../components/common/Navbar';
import { FaAmbulance, FaFireExtinguisher, FaShieldAlt, FaPhoneAlt, FaFemale, FaChild } from 'react-icons/fa';

const Emergency = () => {
    const contacts = [
        { title: "Police Control Room", number: "100", icon: FaShieldAlt, color: "bg-blue-600", border: "border-blue-700" },
        { title: "Fire Brigade", number: "101", icon: FaFireExtinguisher, color: "bg-red-600", border: "border-red-700" },
        { title: "Ambulance / Medical", number: "102", icon: FaAmbulance, color: "bg-green-600", border: "border-green-700" },
        { title: "Women Helpline", number: "1091", icon: FaFemale, color: "bg-pink-500", border: "border-pink-600" },
        { title: "Child Helpline", number: "1098", icon: FaChild, color: "bg-yellow-500", border: "border-yellow-600" },
        { title: "Disaster Management", number: "108", icon: FaPhoneAlt, color: "bg-orange-500", border: "border-orange-600" }
    ];

    const handleCall = (number) => {
        window.location.href = `tel:${number}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <div className="inline-block p-4 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 mb-4 animate-pulse">
                        <FaPhoneAlt size={48} />
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-2 uppercase tracking-wide">Emergency Contacts</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">Instant access to critical city services. Tap any number on a mobile device to dial immediately.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                    {contacts.map((contact, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleCall(contact.number)}
                            className={`${contact.color} text-white rounded-2xl p-6 shadow-xl border-b-8 ${contact.border} transform transition cursor-pointer hover:-translate-y-2 hover:shadow-2xl active:translate-y-0 relative overflow-hidden`}
                        >
                            {/* Decorative background icon */}
                            <contact.icon className="absolute -bottom-4 -right-4 text-9xl opacity-10" />
                            
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex items-center mb-4">
                                    <contact.icon className="text-3xl mr-3" />
                                    <h2 className="text-2xl font-bold">{contact.title}</h2>
                                </div>
                                <div className="mt-8 flex justify-between items-end">
                                    <span className="text-4xl font-black tracking-wider">{contact.number}</span>
                                    <span className="text-sm font-semibold uppercase bg-white/20 px-3 py-1 rounded-full">Tap to Call</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow text-center border dark:border-gray-700 transition-colors">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Notice</h3>
                    <p className="text-gray-600 dark:text-gray-400">Misuse of emergency numbers is a punishable offense. Please actively ensure these lines remain open for true emergencies.</p>
                </div>
            </div>
        </div>
    );
};

export default Emergency;
