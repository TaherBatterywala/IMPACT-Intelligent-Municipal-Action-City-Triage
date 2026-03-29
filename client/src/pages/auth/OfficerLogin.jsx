import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const OfficerLogin = () => {
    const [formData, setFormData] = useState({
        officerId: '',
        password: ''
    });
    const { officerLogin } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await officerLogin(formData.officerId, formData.password);
            navigate('/officer/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex min-h-screen relative">
            <div className="absolute top-4 right-4 z-50">
                <LanguageSwitcher />
            </div>
            
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 bg-cover bg-center relative"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')" }}>
                <div className="absolute inset-0 bg-secondary/70 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-center p-12">
                        <h1 className="text-5xl font-bold mb-6">IMPACT</h1>
                        <p className="text-xl">Intelligent Municipal Action & City Triage</p>
                        <p className="mt-8 text-yellow-300 font-semibold border-t border-white/30 pt-4 uppercase tracking-wider text-sm">Internal Staff Portal</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-secondary">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Officer Portal</h2>
                        <p className="text-gray-500">Authorized Personnel Only</p>
                    </div>

                    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input label="Officer Username" placeholder="Username" name="officerId" value={formData.officerId} onChange={handleChange} required />
                        <Input label="Password" placeholder="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />

                        <Button variant="secondary" type="submit" className="w-full py-3 shadow-lg">Access Dashboard</Button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-secondary text-sm font-semibold hover:underline bg-secondary/10 px-4 py-2 rounded-lg transition-colors">Return to Citizen Portal</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfficerLogin;
