import React, { useState, useEffect } from 'react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import { FaCarSide, FaCheckCircle, FaExclamationTriangle, FaReceipt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import API from '../../services/api';

const TrafficChallan = () => {
    const [challans, setChallans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        fetchMyChallans();
    }, []);

    const fetchMyChallans = async () => {
        setIsLoading(true);
        try {
            const res = await API.get('/challans/my');
            setChallans(res.data);
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Failed to fetch your E-Challans', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const payChallan = async (challanId, amount) => {
        const result = await Swal.fire({
            title: 'Confirm Payment',
            text: `Are you sure you want to pay ₹${amount} via Payment Gateway?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Pay Now'
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'Processing Payment...',
                text: 'Please wait, do not refresh the page.',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            try {
                // Simulate gateway delay
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Real DB update
                await API.put(`/challans/${challanId}/pay`);
                
                fetchMyChallans(); // Refresh list to show 'Paid'
                Swal.fire('Payment Successful!', 'Your E-Challan has been settled.', 'success');
            } catch (error) {
                Swal.fire('Payment Failed', 'Something went wrong during the transaction.', 'error');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8 relative">
                <main className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
                    <div className="bg-yellow-500 p-6 text-white text-center">
                        <FaCarSide className="text-5xl mx-auto mb-2" />
                        <h1 className="text-3xl font-bold">Traffic E-Challan</h1>
                        <p className="opacity-90 mt-1">Check and pay your pending traffic fines instantly</p>
                    </div>

                    <div className="p-8">
                        {isLoading ? (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading your E-Challan history...</div>
                        ) : challans.length === 0 ? (
                            <div className="border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 rounded-xl p-10 text-center animate-fade-in">
                                <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                                <h4 className="text-2xl font-bold text-gray-800 dark:text-white">No Pending Challans</h4>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">Thank you for following traffic rules and driving safely.</p>
                            </div>
                        ) : (
                            <div className="animate-fade-in space-y-6">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2"><FaReceipt/> Your Fines History</h3>
                                
                                {challans.map(challan => (
                                    <div key={challan._id} className={`border rounded-xl p-6 transition-colors duration-200 ${challan.status === 'Paid' ? 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/10' : 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20'}`}>
                                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                                            <div>
                                                <div className={`flex items-center font-bold mb-2 ${challan.status === 'Paid' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                                    {challan.status === 'Paid' ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />} 
                                                    {challan.status === 'Paid' ? 'Challan Paid' : 'Unpaid Challan'}
                                                </div>
                                                <p className="text-gray-800 dark:text-gray-200 font-mono font-semibold text-lg">{challan.vehicleNumber}</p>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">{challan.reason}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Issued: {new Date(challan.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-700 md:pl-6 leading-tight flex flex-row items-center justify-between md:flex-col md:items-end">
                                                <p className="text-3xl font-bold text-gray-800 dark:text-white">₹{challan.amount}</p>
                                                {challan.status === 'Paid' ? (
                                                    <span className="mt-4 px-4 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 font-bold rounded-lg text-sm inline-block">Paid Successfully</span>
                                                ) : (
                                                    <Button onClick={() => payChallan(challan._id, challan.amount)} className="mt-4 bg-red-600 hover:bg-red-700 py-1.5 min-w-[120px]">Pay Now</Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TrafficChallan;
