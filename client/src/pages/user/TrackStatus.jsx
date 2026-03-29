import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import { useComplaint } from '../../context/ComplaintContext';
import { FaCheckCircle, FaHourglassHalf, FaCog, FaUserTie, FaClipboardList } from 'react-icons/fa';

const TrackStatus = () => {
    const { complaints, fetchMyComplaints } = useComplaint();
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        fetchMyComplaints();
    }, []);

    // Combine mock updates with real messages from officers
    const getMessages = (complaint) => {
        let messages = [
            { sender: "System", time: complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString() : "Just Now", text: "Complaint Received and registered." }
        ];
        const status = complaint.status || 'Pending';
        if (status === 'Assigned' || status === 'In Progress' || status === 'Resolved') {
            messages.push({ sender: "System", time: "Update", text: "We have assigned an officer to verify your location." });
        }
        if (status === 'In Progress' || status === 'Resolved') {
            messages.push({ sender: "System", time: "Update", text: "Materials have been dispatched. Work is underway." });
        }
        if (status === 'Resolved') {
            messages.push({ sender: "System", time: "Update", text: "The issue has been successfully resolved. Please inspect." });
        }

        // Add real messages from the database
        if (complaint.messages && complaint.messages.length > 0) {
            const realMsgs = complaint.messages.map(m => ({
                sender: m.sender || 'Officer',
                time: new Date(m.time).toLocaleDateString(),
                text: m.text
            }));
            messages = [...messages, ...realMsgs];
        }

        return messages;
    };

    const StatusIcon = ({ status, active }) => {
        const icons = {
            'Pending': <FaHourglassHalf className={active ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"} size={24}/>,
            'Assigned': <FaUserTie className={active ? "text-blue-500" : "text-gray-300 dark:text-gray-600"} size={24}/>,
            'In Progress': <FaCog className={active ? "text-orange-500 animate-spin-slow" : "text-gray-300 dark:text-gray-600"} size={24}/>,
            'Resolved': <FaCheckCircle className={active ? "text-green-500" : "text-gray-300 dark:text-gray-600"} size={24}/>
        };
        return icons[status] || icons['Pending'];
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Fixed List Side */}
                <div className="md:col-span-1 border-r dark:border-gray-700 pr-4">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Complaints</h2>
                    {(!complaints || complaints.length === 0) ? (
                        <p className="text-gray-500 dark:text-gray-400">You have no recorded complaints.</p>
                    ) : (
                        <div className="space-y-4">
                            {(complaints || []).map(c => (
                                <div 
                                    key={c._id || Math.random()} 
                                    onClick={() => setSelectedComplaint(c)}
                                    className={`p-4 rounded-xl cursor-pointer border transition-all ${
                                        selectedComplaint?._id === c._id 
                                        ? 'border-primary bg-blue-50 dark:bg-blue-900/20' 
                                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-gray-800 dark:text-white">{c.category || 'Unknown'}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            c.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' :
                                            c.status === 'In Progress' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                                        }`}>
                                            {c.status || 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{c.subCategory || 'No Details'}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just Now'}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detail Side */}
                <div className="md:col-span-2">
                    {selectedComplaint ? (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-200">
                            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{selectedComplaint.category}: {selectedComplaint.subCategory}</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                                📍 {selectedComplaint.location}
                            </p>
                            
                            {selectedComplaint.assignedOfficerName && (
                                <div className="mb-8 inline-flex bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm items-center gap-2">
                                    <FaUserTie className="text-blue-500" />
                                    <span className="font-semibold text-gray-700 dark:text-gray-300 mr-2">Handling Officer:</span>
                                    {selectedComplaint.assignedOfficerName}
                                </div>
                            )}

                            {/* Timeline */}
                            <div className="relative mb-12">
                                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
                                <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
                                    style={{
                                        width: selectedComplaint.status === 'Resolved' ? '100%' :
                                               selectedComplaint.status === 'In Progress' ? '66%' :
                                               selectedComplaint.status === 'Assigned' ? '33%' : '0%'
                                    }}></div>
                                
                                <div className="flex justify-between relative z-10 w-full px-2">
                                    {['Pending', 'Assigned', 'In Progress', 'Resolved'].map(step => {
                                        const isActive = 
                                            step === 'Pending' || 
                                            (step === 'Assigned' && ['Assigned', 'In Progress', 'Resolved'].includes(selectedComplaint.status)) ||
                                            (step === 'In Progress' && ['In Progress', 'Resolved'].includes(selectedComplaint.status)) ||
                                            (step === 'Resolved' && selectedComplaint.status === 'Resolved');
                                        
                                        return (
                                            <div key={step} className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-md border-2 
                                                    ${isActive ? 'border-primary' : 'border-gray-200 dark:border-gray-600'} transition-colors`}>
                                                    <StatusIcon status={step} active={isActive} />
                                                </div>
                                                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-gray-800 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`}>{step}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <hr className="dark:border-gray-700 my-6" />

                            <div className="mb-8">
                                <h3 className="text-xl font-bold dark:text-gray-200 mb-3">Original Description</h3>
                                <p className="text-gray-700 dark:text-gray-300 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg whitespace-pre-wrap">{selectedComplaint.description}</p>
                                {selectedComplaint.image && !selectedComplaint.image.includes('placeholder.com') && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Attached Image</h4>
                                        <img src={selectedComplaint.image} alt="Complaint" className="w-full max-w-sm rounded-lg shadow border dark:border-gray-700" />
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-xl font-bold dark:text-gray-200 mb-4">Department Updates</h3>
                                <div className="space-y-4">
                                    {getMessages(selectedComplaint).map((msg, i) => (
                                        <div key={i} className={`p-4 rounded-xl ${msg.sender === 'System' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50'}`}>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{msg.sender}</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">{msg.time}</span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">{msg.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center text-gray-500 dark:text-gray-400 flex flex-col items-center justify-center transition-colors duration-200 h-full">
                            <FaClipboardList className="text-6xl mb-4 opacity-20" />
                            <p className="text-lg">Select a complaint from the list to view its full tracking details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackStatus;
