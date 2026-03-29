import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        city: '',
        wardNumber: ''
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
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
                <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-center p-12">
                        <h1 className="text-5xl font-bold mb-6">IMPACT</h1>
                        <p className="text-xl">Intelligent Municipal Action & City Triage</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                    <h2 className="text-3xl font-bold text-primary mb-2 text-center">Citizen Registration</h2>
                    <p className="text-gray-500 text-center mb-8">Join us to make your city better</p>

                    {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Full Name" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
                        <Input label="Email Address" type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                        <Input label="Phone Number" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                        <Input label="Password" type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                        <div className="flex gap-4">
                            <Input label="City" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-1/2" />
                            <Input label="Ward Number" type="number" name="wardNumber" placeholder="Pin Code" value={formData.wardNumber} onChange={handleChange} required className="w-1/2" />
                        </div>

                        <Button type="submit" className="w-full mt-4">Create Account</Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
