import React, { useState } from 'react';
import { FaUserCircle, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaShare, FaCommentDots } from 'react-icons/fa';
import Button from '../common/Button';
import API from '../../services/api';

const TaskBoard = ({ complaints, onAssign, onResolve, onMessage }) => {
    const [activeTab, setActiveTab] = useState('Pending');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [detailLoading, setDetailLoading] = useState(false);

    // Lazy-load full complaint (incl. image) when officer clicks View Details
    const handleViewDetails = async (complaint) => {
        setSelectedComplaint(complaint); // show modal instantly with list data
        if (complaint.image) return;     // already cached
        setDetailLoading(true);
        try {
            const res = await API.get(`/complaints/${complaint._id}`);
            setSelectedComplaint(res.data);
        } catch (e) {
            console.error('Failed to load complaint detail:', e);
        } finally {
            setDetailLoading(false);
        }
    };

    // Filter complaints based on tab
    const filteredComplaints = complaints.filter(c => {
        if (activeTab === 'Pending') return c.status === 'Pending';
        if (activeTab === 'Assigned') return c.status === 'Assigned' || c.status === 'In Progress';
        if (activeTab === 'Resolved') return c.status === 'Resolved';
        return true;
    });

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden min-h-[500px]">
            {/* Tabs */}
            <div className="flex border-b dark:border-gray-700">
                {['Pending', 'Assigned', 'Resolved'].map((tab) => (
                    <button
                        key={tab}
                        className={`flex-1 py-4 text-center font-medium transition-colors ${activeTab === tab
                            ? 'bg-primary/5 text-primary border-b-2 border-primary'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                        <span className="ml-2 bg-gray-100 dark:bg-gray-700 text-xs px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                            {complaints.filter(c => {
                                if (tab === 'Pending') return c.status === 'Pending';
                                if (tab === 'Assigned') return c.status === 'Assigned' || c.status === 'In Progress';
                                if (tab === 'Resolved') return c.status === 'Resolved';
                                return false;
                            }).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredComplaints.length > 0 ? (
                    filteredComplaints.map((complaint) => (
                        <div key={complaint._id} className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 border border-gray-100 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex flex-col gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${complaint.status === 'Pending' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                        complaint.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                        }`}>
                                        {complaint.status}
                                    </span>
                                    {complaint.aiSeverity && (
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border w-fit ${complaint.aiSeverity === 'Urgent' || complaint.aiSeverity === 'High' ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}>
                                            Priority: {complaint.aiSeverity}
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-400 dark:text-gray-500 text-xs flex items-center">
                                    <FaCalendarAlt className="mr-1" />
                                    {new Date(complaint.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <h4 className="font-bold text-gray-800 dark:text-white mb-2">{complaint.subCategory}</h4>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{complaint.description}</p>

                            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                                <FaMapMarkerAlt className="mr-2 text-primary" />
                                {complaint.location}
                            </div>
                            
                            {complaint.assignedOfficerName && (
                                <div className="text-sm text-blue-700 dark:text-blue-300 mb-4 font-medium bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-800/50">
                                    Assigned To: {complaint.assignedOfficerName}
                                </div>
                            )}

                            <div className="flex gap-2 mt-auto w-full">
                                {activeTab === 'Pending' && (
                                    <>
                                        <Button
                                            variant="primary"
                                            className="flex-1 text-sm py-1.5 flex items-center justify-center gap-2"
                                            onClick={() => onAssign(complaint._id)}
                                        >
                                            <FaShare /> Assign
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="flex-1 text-sm py-1.5"
                                            onClick={() => handleViewDetails(complaint)}
                                        >
                                            View Details
                                        </Button>
                                    </>
                                )}

                                {activeTab === 'Assigned' && (
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="flex gap-2">
                                            <Button
                                                variant="secondary"
                                                className="flex-1 text-sm py-1 font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                                                onClick={() => onAssign(complaint._id)}
                                            >
                                                Re-assign
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="flex-1 text-sm py-1 bg-green-600 hover:bg-green-700 text-white border-0"
                                                onClick={() => onResolve(complaint._id)}
                                            >
                                                Resolve
                                            </Button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="w-full text-sm py-1 border dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            onClick={() => handleViewDetails(complaint)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                )}
                                {activeTab === 'Resolved' && (
                                    <Button
                                        variant="ghost"
                                        className="w-full text-sm py-1.5"
                                        onClick={() => setSelectedComplaint(complaint)}
                                    >
                                        View Details
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No {activeTab.toLowerCase()} complaints found.
                    </div>
                )}
            </div>

            {/* Modal for Details and Messaging */}
            {selectedComplaint && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative transition-colors duration-200">
                        <button 
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                            onClick={() => { setSelectedComplaint(null); setMessageText(''); setDetailLoading(false); }}
                        >
                            &times; Close
                        </button>
                        
                        <h2 className="text-2xl font-bold mb-4 dark:text-white">{selectedComplaint.category}: {selectedComplaint.subCategory}</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2 mb-2">Complaint Info</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Status:</strong> <span className="text-primary">{selectedComplaint.status}</span></p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Location:</strong> {selectedComplaint.location}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Date:</strong> {new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                                {selectedComplaint.aiCategory && (
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Suggested Dept:</strong> <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedComplaint.aiCategory}</span></p>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 border dark:border-gray-600 p-3 rounded bg-gray-50 dark:bg-gray-700">{selectedComplaint.description}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-700 dark:text-gray-200 border-b dark:border-gray-700 pb-2 mb-2">Citizen Details</h3>
                                {selectedComplaint.userId ? (
                                    <>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Name:</strong> {selectedComplaint.userId.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Phone:</strong> {selectedComplaint.userId.phone}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>Email:</strong> {selectedComplaint.userId.email}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-1"><strong>City/Ward:</strong> {selectedComplaint.userId.city} - {selectedComplaint.userId.wardNumber}</p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">User data not available.</p>
                                )}
                            </div>
                        </div>

                        {/* Image section with lazy-load spinner */}
                        {detailLoading && (
                            <div className="mb-6 flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500">
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                Loading image...
                            </div>
                        )}
                        {!detailLoading && selectedComplaint.image && !selectedComplaint.image.includes('placeholder.com') && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Attached Photo</h3>
                                    {selectedComplaint.aiDetections && selectedComplaint.aiDetections.length > 0 && (
                                        <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 flex items-center font-medium shadow-sm">
                                            Detected: {Array.from(new Set(selectedComplaint.aiDetections.map(d => d.class))).join(', ')}
                                        </span>
                                    )}
                                </div>
                                <img src={selectedComplaint.image} alt="Complaint" className="w-full max-h-64 object-contain rounded border" />
                            </div>
                        )}

                        <div className="border-t dark:border-gray-700 pt-6">
                            <h3 className="font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                                <FaCommentDots className="text-primary" /> Send Update / Message
                            </h3>
                            <textarea 
                                className="w-full border dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg p-3 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary"
                                rows="3"
                                placeholder="Type a message or update to send to the citizen..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            ></textarea>
                            <div className="flex justify-end">
                                <Button 
                                    variant="primary" 
                                    onClick={() => {
                                        onMessage(selectedComplaint._id, messageText);
                                        setMessageText('');
                                    }}
                                    disabled={!messageText.trim()}
                                >
                                    Send Message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskBoard;
