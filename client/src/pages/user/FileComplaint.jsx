import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaWater, FaRoad, FaTrash, FaBolt, FaHeartbeat, FaMicrophone, FaStop } from 'react-icons/fa';
import { useComplaint } from '../../context/ComplaintContext';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Swal from 'sweetalert2';

const categories = [
    { id: 'Water', icon: FaWater, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'Roads', icon: FaRoad, color: 'text-gray-700 dark:text-gray-300', bg: 'bg-gray-200 dark:bg-gray-700/50' },
    { id: 'Sanitation', icon: FaTrash, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30' },
    { id: 'Electricity', icon: FaBolt, color: 'text-yellow-500 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 'Health', icon: FaHeartbeat, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
];

const issueTypes = {
    Water: ["Leakage", "No Supply", "Contaminated/Polluted", "Low Pressure", "Pipe Burst", "Other"],
    Roads: ["Pothole", "Damaged Road", "Waterlogging", "Faded Markings", "Other"],
    Sanitation: ["Garbage Accumulation", "Dead Animal", "Blocked Drain", "Public Toilet Issue", "Other"],
    Electricity: ["Power Outage", "Broken Streetlight", "Sparking Wire", "Fallen Pole", "Other"],
    Health: ["Stray Animal Problem", "Mosquito Breeding", "Illegal Clinic", "Food Quality Concern", "Other"]
};

const FileComplaint = () => {
    const navigate = useNavigate();
    const { createComplaint } = useComplaint();
    const [step, setStep] = useState(1);

    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const intendedListeningRef = useRef(false);

    const [formData, setFormData] = useState({
        category: '',
        subCategory: '',
        description: '',
        location: '',
        image: ''
    });

    const formDataRef = useRef(formData);
    useEffect(() => {
        formDataRef.current = formData;
    }, [formData]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        let localBaseText = formDataRef.current.description;
        if (localBaseText && !localBaseText.endsWith(' ')) {
            localBaseText += ' ';
        }

        let finalTranscript = localBaseText;

        recognition.onresult = (e) => {
            let interimTranscript = '';
            for (let i = e.resultIndex; i < e.results.length; ++i) {
                if (e.results[i].isFinal) {
                    finalTranscript += e.results[i][0].transcript;
                } else {
                    interimTranscript += e.results[i][0].transcript;
                }
            }
            
            setFormData(prev => ({
                ...prev,
                description: finalTranscript + interimTranscript
            }));
        };

        recognition.onstart = () => {
             setIsListening(true);
        };

        recognition.onerror = (event) => {
             console.error('Speech error:', event.error);
             if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                 intendedListeningRef.current = false;
                 setIsListening(false);
             }
        };

        recognition.onend = () => {
             if (intendedListeningRef.current) {
                 setTimeout(startRecognition, 50);
             } else {
                 setIsListening(false);
             }
        };

        recognitionRef.current = recognition;
        try {
            recognition.start();
        } catch(err) {
            console.error("Failed to start recognition:", err);
            intendedListeningRef.current = false;
            setIsListening(false);
        }
    };

    const toggleRecording = (e) => {
        if (e) e.preventDefault();

        if (isListening) {
            intendedListeningRef.current = false;
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            setIsListening(false);
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            Swal.fire('Not Supported', 'Your browser does not support Speech Recognition.', 'info');
            return;
        }

        intendedListeningRef.current = true;
        startRecognition();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const [customSubCategory, setCustomSubCategory] = useState('');

    const handleCategorySelect = (cat) => {
        setFormData({ ...formData, category: cat, subCategory: '' });
        setCustomSubCategory('');
        setStep(2);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const finalSubCategory = formData.subCategory === 'Other' ? customSubCategory : formData.subCategory;
            await createComplaint({
                ...formData,
                subCategory: finalSubCategory,
                image: formData.image || 'https://via.placeholder.com/300'
            });
            await Swal.fire('Success!', 'Complaint Submitted Successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            Swal.fire('Error!', 'Failed to submit complaint', 'error');
        }
    };

    const canProceedStep2 = formData.subCategory && (formData.subCategory !== 'Other' || customSubCategory.trim() !== '');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-200">
                    <h1 className="text-2xl font-bold mb-6 text-center dark:text-white">File a Complaint</h1>

                    <div className="flex justify-center mb-8">
                        {[1, 2, 3, 4].map(s => (
                            <div key={s} className={`w-3 h-3 rounded-full mx-2 ${s <= step ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`} />
                        ))}
                    </div>

                    {step === 1 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`p-6 rounded-xl flex flex-col items-center justify-center transition-all hover:scale-105 ${cat.bg}`}
                                >
                                    <cat.icon className={`text-4xl mb-2 ${cat.color}`} />
                                    <span className="font-medium dark:text-gray-200">{cat.id}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white">Select Sub-Category for {formData.category}</h2>
                            <select
                                name="subCategory"
                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white dark:bg-gray-700 dark:text-white transition-colors duration-200"
                                onChange={handleChange}
                                value={formData.subCategory}
                            >
                                <option value="">Select Issue Type</option>
                                {(issueTypes[formData.category] || []).map(issue => (
                                    <option key={issue} value={issue}>{issue}</option>
                                ))}
                            </select>

                            {formData.subCategory === 'Other' && (
                                <div className="mt-4 fade-in">
                                    <Input
                                        label="Name your issue"
                                        name="customSubCategory"
                                        placeholder="Name your issue"
                                        value={customSubCategory}
                                        onChange={(e) => setCustomSubCategory(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="flex justify-between mt-6">
                                <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
                                <Button onClick={() => setStep(3)} disabled={!canProceedStep2}>Next</Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold mb-4 dark:text-white">Details & Location</h2>
                            <div className="relative">
                                <textarea
                                    name="description"
                                    placeholder="Describe the issue in detail..."
                                    className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary outline-none h-32 pr-12 dark:bg-gray-700 dark:text-white transition-colors duration-200 ${isListening ? 'bg-indigo-50 border-indigo-300 dark:bg-indigo-900 dark:border-indigo-500' : ''}`}
                                    onChange={handleChange}     
                                    value={formData.description}
                                ></textarea>
                                <button 
                                    onClick={toggleRecording}
                                    title="Dictate with voice"
                                    className={`absolute right-3 bottom-4 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500'}`}
                                >
                                    {isListening ? <FaStop size={16} /> : <FaMicrophone size={16} />}
                                </button>
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Image (Optional)</label>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-blue-700 dark:text-gray-300 dark:file:bg-primary dark:file:text-white"
                                />
                                {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded shadow" />}
                            </div>

                            <Input
                                label="Location (Ward/Area)"
                                name="location"
                                placeholder="Location (Ward/Area)"
                                value={formData.location}
                                onChange={handleChange}
                            />
                            <div className="flex justify-between mt-6">
                                <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
                                <Button onClick={() => setStep(4)} disabled={!formData.description || !formData.location}>Next</Button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4 dark:text-white">Confirm Submission</h2>
                            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-left mb-6 border dark:border-gray-600 dark:text-gray-200">
                                <p><strong>Category:</strong> {formData.category}</p>
                                <p><strong>Issue:</strong> {formData.subCategory === 'Other' ? customSubCategory : formData.subCategory}</p>
                                <p><strong>Location:</strong> {formData.location}</p>
                                <p><strong>Description:</strong> {formData.description}</p>
                                {formData.image && <p className="mt-2"><strong>Image Attached</strong> ✔️</p>}
                            </div>
                            <div className="flex justify-between gap-4">
                                <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
                                <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">Submit Complaint</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileComplaint;
