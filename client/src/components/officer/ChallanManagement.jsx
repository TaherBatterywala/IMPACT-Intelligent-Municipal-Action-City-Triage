import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Button from '../common/Button';
import Swal from 'sweetalert2';
import { FaMoneyBillWave, FaCar, FaPhone, FaRegStickyNote } from 'react-icons/fa';

const ChallanManagement = () => {
    const [challans, setChallans] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [mobileNumber, setMobileNumber] = useState('');
    const [vehicleNumber, setVehicleNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('No Helmet');

    const reasons = [
        'No Helmet',
        'Red Light Jump',
        'Over Speeding',
        'No License',
        'Wrong Parking',
        'Without Seatbelt',
        'Drunk Driving',
        'Other'
    ];

    useEffect(() => {
        fetchChallans();
    }, []);

    const fetchChallans = async () => {
        setLoading(true);
        try {
            const res = await API.get('/challans/officer');
            setChallans(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleIssueChallan = async (e) => {
        e.preventDefault();
        if (!mobileNumber || !vehicleNumber || !amount || !reason) {
            Swal.fire('Incomplete', 'Please fill all fields', 'warning');
            return;
        }

        try {
            await API.post('/challans', { mobileNumber, vehicleNumber, amount: Number(amount), reason });
            Swal.fire('Issued!', 'Challan successfully recorded against ' + vehicleNumber, 'success');
            
            // Clear form
            setMobileNumber('');
            setVehicleNumber('');
            setAmount('');
            setReason('No Helmet');
            
            // Refresh
            fetchChallans();
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to issue challan', 'error');
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2 dark:border-gray-700">Issue New E-Challan</h2>
            
            <form onSubmit={handleIssueChallan} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><FaPhone/> Mobile Number</label>
                    <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="e.g. 9876543210"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><FaCar/> Vehicle No.</label>
                    <input 
                        type="text" 
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="e.g. MH 12 AB 1234"
                        value={vehicleNumber}
                        onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><FaRegStickyNote/> Reason</label>
                    <select 
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    >
                        {reasons.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2"><FaMoneyBillWave/> Amount (₹)</label>
                    <input 
                        type="number" 
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                        placeholder="e.g. 500"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="100"
                        required
                    />
                </div>
                
                <div className="col-span-1 md:col-span-2 lg:col-span-4 mt-2">
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-3 text-white">Issue E-Challan</Button>
                </div>
            </form>

            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Recent E-Challans Issued</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Mobile No.</th>
                            <th className="px-4 py-3">Vehicle</th>
                            <th className="px-4 py-3">Reason</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                            <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" className="text-center py-4">Loading...</td></tr>
                        ) : challans.length === 0 ? (
                            <tr><td colSpan="6" className="text-center py-4">No challans issued yet.</td></tr>
                        ) : (
                            challans.map(c => (
                                <tr key={c._id} className="border-b dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <td className="px-4 py-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{c.mobileNumber}</td>
                                    <td className="px-4 py-3 font-mono">{c.vehicleNumber}</td>
                                    <td className="px-4 py-3">{c.reason}</td>
                                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white font-bold">₹{c.amount}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${c.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ChallanManagement;
