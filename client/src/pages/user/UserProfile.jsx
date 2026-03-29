import React, { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { FaUserEdit, FaEnvelope, FaPhoneAlt, FaCity, FaMapMarkerAlt, FaIdBadge, FaSave, FaTimes, FaLock } from 'react-icons/fa';
import Swal from 'sweetalert2';

const UserProfile = () => {
    const { user, updateUser } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Editing state
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        wardNumber: '',
        password: '' // Optional
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await API.get('/users/me');
            setProfileData(res.data);
            setEditForm({
                name: res.data.name || '',
                email: res.data.email || '',
                phone: res.data.phone || '',
                city: res.data.city || '',
                wardNumber: res.data.wardNumber || '',
                password: ''
            });
        } catch (err) {
            console.error("Failed to load profile", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditChange = (e) => {
        setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async () => {
        try {
            Swal.fire({
                title: 'Saving Profile...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            const submitData = { ...editForm };
            if (!submitData.password) {
                delete submitData.password; // prevent sending empty string to DB
            }

            const res = await API.put('/users/profile', submitData);
            
            // Sync context
            updateUser(res.data);
            setProfileData(res.data);
            setEditForm(prev => ({ ...prev, password: '' })); // Clear password field
            setIsEditing(false);
            
            Swal.fire('Success', 'Profile updated successfully!', 'success');
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || 'Failed to update profile', 'error');
        }
    };

    const cancelEdit = () => {
        setIsEditing(false);
        // Reset form
        setEditForm({
            name: profileData?.name || '',
            email: profileData?.email || '',
            phone: profileData?.phone || '',
            city: profileData?.city || '',
            wardNumber: profileData?.wardNumber || '',
            password: ''
        });
    };

    if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center dark:text-white transition-colors duration-200"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full font-bold"></div></div>;

    const data = profileData || user;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden transition-colors border border-gray-100 dark:border-gray-700">
                    {/* Header Banner */}
                    <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-500 relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/20" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
                    </div>
                    
                    {/* Avatar & Name */}
                    <div className="relative px-6 sm:px-12 pb-12">
                        <div className="absolute -top-20 w-40 h-40 bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm flex items-center justify-center">
                            <div className="w-full h-full bg-blue-50 dark:bg-gray-700 rounded-full flex items-center justify-center text-6xl text-blue-600 dark:text-blue-400 font-extrabold uppercase shadow-inner">
                                {data?.name?.charAt(0) || 'U'}
                            </div>
                        </div>
                        
                        <div className="pt-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div className="flex-1 w-full relative">
                                {isEditing ? (
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight bg-gray-100 dark:bg-gray-700 border-2 border-primary rounded-lg px-3 py-1 outline-none w-full max-w-sm"
                                        placeholder="Your Name"
                                    />
                                ) : (
                                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight break-all">{data?.name || 'Local Citizen'}</h1>
                                )}
                                <p className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm flex items-center mt-2 bg-gray-100 dark:bg-gray-700/50 w-max px-3 py-1 rounded-full">
                                    <FaIdBadge className="mr-2 opacity-70" /> {data?.role || 'Citizen'} Account
                                </p>
                            </div>
                            
                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button onClick={cancelEdit} className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-bold transition-all shadow-sm">
                                            <FaTimes /> Cancel
                                        </button>
                                        <button onClick={handleSaveProfile} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm">
                                            <FaSave /> Save
                                        </button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-3 rounded-xl font-bold transition-all shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow active:scale-95">
                                        <FaUserEdit className="text-lg" /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className={`mt-12 grid grid-cols-1 ${isEditing ? 'lg:grid-cols-2' : 'sm:grid-cols-2'} gap-6`}>
                            <div className={`group flex items-center p-5 bg-white ${!isEditing && 'hover:bg-blue-50/50 dark:hover:bg-gray-700/50'} dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all ${!isEditing && 'hover:shadow-md'}`}>
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl mr-5 shrink-0 group-hover:scale-110 transition-transform">
                                    <FaEnvelope />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Email Address</p>
                                    {isEditing ? (
                                        <input type="email" name="email" value={editForm.email} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-primary rounded p-2 text-gray-800 dark:text-white outline-none" placeholder="Email"/>
                                    ) : (
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-lg">{data?.email || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div className={`group flex items-center p-5 bg-white ${!isEditing && 'hover:bg-green-50/50 dark:hover:bg-gray-700/50'} dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all ${!isEditing && 'hover:shadow-md'}`}>
                                <div className="w-14 h-14 rounded-2xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center text-2xl mr-5 shrink-0 group-hover:scale-110 transition-transform">
                                    <FaPhoneAlt />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Phone Number</p>
                                    {isEditing ? (
                                        <input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-primary rounded p-2 text-gray-800 dark:text-white outline-none" placeholder="Phone Number" />
                                    ) : (
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-lg">{data?.phone || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className={`group flex items-center p-5 bg-white ${!isEditing && 'hover:bg-indigo-50/50 dark:hover:bg-gray-700/50'} dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all ${!isEditing && 'hover:shadow-md'}`}>
                                <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mr-5 shrink-0 group-hover:scale-110 transition-transform">
                                    <FaCity />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">City</p>
                                    {isEditing ? (
                                        <input type="text" name="city" value={editForm.city} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-primary rounded p-2 text-gray-800 dark:text-white outline-none" placeholder="City" />
                                    ) : (
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-lg">{data?.city || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>

                            <div className={`group flex items-center p-5 bg-white ${!isEditing && 'hover:bg-purple-50/50 dark:hover:bg-gray-700/50'} dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all ${!isEditing && 'hover:shadow-md'}`}>
                                <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center text-2xl mr-5 shrink-0 group-hover:scale-110 transition-transform">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="overflow-hidden flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">Ward Number</p>
                                    {isEditing ? (
                                        <input type="number" name="wardNumber" value={editForm.wardNumber} onChange={handleEditChange} className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-primary rounded p-2 text-gray-800 dark:text-white outline-none" placeholder="Ward Number" />
                                    ) : (
                                        <p className="font-semibold text-gray-800 dark:text-gray-200 truncate text-lg">{data?.wardNumber || 'Not Provided'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password Field (Only during editing) */}
                            {isEditing && (
                                <div className="group flex items-center p-5 bg-red-50 dark:bg-gray-800 rounded-2xl border-2 border-primary shadow-sm lg:col-span-2">
                                    <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center text-2xl mr-5 shrink-0">
                                        <FaLock />
                                    </div>
                                    <div className="overflow-hidden flex-1">
                                        <p className="text-xs text-red-500 dark:text-red-400 font-bold uppercase tracking-wider mb-1">Update Password</p>
                                        <input 
                                            type="password" 
                                            name="password" 
                                            value={editForm.password} 
                                            onChange={handleEditChange} 
                                            placeholder="Leave blank to keep current password"
                                            className="w-full bg-white dark:bg-gray-900 outline-none rounded p-2 text-gray-800 dark:text-white placeholder-gray-400" 
                                        />
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
