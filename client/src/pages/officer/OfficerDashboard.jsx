import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import StatsCard from '../../components/officer/StatsCard';
import TaskBoard from '../../components/officer/TaskBoard';
import ChallanManagement from '../../components/officer/ChallanManagement';
import { useComplaint } from '../../context/ComplaintContext';
import { useAuth } from '../../context/AuthContext';
import { FaClipboardList, FaCheckCircle, FaExclamationCircle, FaReceipt, FaTasks } from 'react-icons/fa';
import API from '../../services/api';
import Swal from 'sweetalert2';

const OfficerDashboard = () => {
    const { user } = useAuth();
    const { complaints, fetchOfficerComplaints, loading, updateComplaintStatus } = useComplaint();
    const [stats, setStats] = useState({ total: 0, pending: 0, resolved: 0 });

    useEffect(() => {
        fetchOfficerComplaints();
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await API.get('/officer/stats');
            setStats(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleAssign = async (id) => {
        const { value: juniorName } = await Swal.fire({
            title: 'Assign Officer',
            input: 'text',
            inputLabel: 'Enter Officer Name to Assign:',
            inputValue: 'Junior Officer 1',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) return 'You need to write an officer name!'
            }
        });

        if (juniorName) {
            try {
                await updateComplaintStatus(id, { status: 'Assigned', assignedOfficerName: juniorName });
                fetchOfficerComplaints(); // Refresh UI to move to Assigned tab and show name
                fetchStats();
                Swal.fire('Assigned!', `Complaint assigned to ${juniorName}`, 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to assign complaint', 'error');
            }
        }
    };

    const handleResolve = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Mark this complaint as resolved?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, resolve it!'
        });

        if (result.isConfirmed) {
            try {
                await API.put(`/officer/resolve/${id}`); // Use specific endpoint
                fetchOfficerComplaints(); // Refresh
                fetchStats();
                Swal.fire('Resolved!', 'The complaint has been marked as resolved.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to resolve complaint', 'error');
            }
        }
    };

    const handleMessage = async (id, messageText) => {
        if (!messageText) return;
        try {
            await API.post(`/officer/message/${id}`, { message: messageText });
            Swal.fire('Sent!', 'Message sent successfully!', 'success');
            fetchOfficerComplaints(); // Refresh complaints to get the new message
        } catch (error) {
            Swal.fire('Error', 'Failed to send message', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Officer Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400">Manage and resolve municipal issues</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatsCard
                        title="Total Complaints"
                        value={stats.total}
                        icon={FaClipboardList}
                        color="bg-white dark:bg-gray-800"
                        textColor="text-gray-800 dark:text-white"
                    />
                    <StatsCard
                        title="Pending Actions"
                        value={stats.pending}
                        icon={FaExclamationCircle}
                        color="bg-red-50 dark:bg-red-900/20"
                        textColor="text-red-700 dark:text-red-400"
                    />
                    <StatsCard
                        title="Resolved Cases"
                        value={stats.resolved}
                        icon={FaCheckCircle}
                        color="bg-green-50 dark:bg-green-900/20"
                        textColor="text-green-700 dark:text-green-400"
                    />
                </div>

                {/* Role-Specific Content Area */}
                {user?.department === 'Traffic Police' ? (
                    <ChallanManagement />
                ) : (
                    <>
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Task Board</h2>
                        {loading ? (
                            <div className="text-center py-12">Loading...</div>
                        ) : (
                            <TaskBoard
                                complaints={complaints}
                                onAssign={handleAssign}
                                onResolve={handleResolve}
                                onMessage={handleMessage}
                            />
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default OfficerDashboard;
