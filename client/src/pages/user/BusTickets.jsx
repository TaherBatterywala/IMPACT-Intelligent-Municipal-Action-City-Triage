import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { FaBus, FaExchangeAlt, FaClock, FaRupeeSign, FaTicketAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';

const BusTickets = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [buses, setBuses] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if(!from || !to || !date) return;
        
        setIsLoading(true);
        setTimeout(() => {
            setBuses([
                { id: 1, operator: "City Express", departure: "08:00 AM", arrival: "11:30 AM", type: "AC Seater", price: 450, seats: 12 },
                { id: 2, operator: "State Transport", departure: "10:15 AM", arrival: "02:00 PM", type: "Non-AC", price: 250, seats: 3 },
                { id: 3, operator: "Luxury Travels", departure: "09:30 PM", arrival: "05:00 AM", type: "AC Sleeper", price: 800, seats: 24 }
            ]);
            setIsLoading(false);
        }, 800);
    };

    const swapCities = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />
            
            <div className="bg-green-600 dark:bg-green-800 text-white py-12 px-4 shadow-inner">
                <div className="max-w-4xl mx-auto flex items-center justify-center flex-col">
                    <FaBus className="text-5xl mb-4" />
                    <h1 className="text-4xl font-bold mb-2">Book Bus Tickets</h1>
                    <p className="opacity-90">Fast, secure, and comfortable travel across the state</p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8 relative -mt-10">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transition-colors duration-200">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 w-full relative">
                            <Input label="Leaving From" placeholder="e.g. Pune" value={from} onChange={e => setFrom(e.target.value)} />
                        </div>
                        
                        <button type="button" onClick={swapCities} className="bg-gray-100 dark:bg-gray-700 p-3 mt-4 md:mt-6 rounded-full text-gray-600 dark:text-gray-300 hover:bg-green-100 hover:text-green-600 transition">
                            <FaExchangeAlt />
                        </button>
                        
                        <div className="flex-1 w-full">
                            <Input label="Going To" placeholder="e.g. Mumbai" value={to} onChange={e => setTo(e.target.value)} />
                        </div>
                        
                        <div className="flex-1 w-full">
                            <Input label="Date of Travel" type="date" value={date} onChange={e => setDate(e.target.value)} />
                        </div>

                        <div className="w-full md:w-auto mt-4 md:mt-6">
                            <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700 py-3">
                                {isLoading ? 'Searching...' : 'Search Buses'}
                            </Button>
                        </div>
                    </form>
                </div>

                {buses.length > 0 && (
                    <div className="mt-8 animate-fade-in flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Available Buses</h2>
                        
                        {buses.map(bus => (
                            <div key={bus.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow flex flex-col md:flex-row justify-between items-center transition-colors duration-200">
                                <div className="mb-4 md:mb-0 text-center md:text-left">
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">{bus.operator}</h3>
                                    <span className="text-sm px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded inline-block mt-2">{bus.type}</span>
                                </div>
                                
                                <div className="flex items-center space-x-8 my-4 md:my-0">
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{bus.departure}</p>
                                    </div>
                                    <div className="flex flex-col items-center px-4 w-32 hidden sm:flex">
                                        <FaClock className="text-gray-400 mb-1" />
                                        <div className="w-full h-px bg-gray-300 dark:bg-gray-600"></div>
                                        <span className="text-xs text-gray-500 mt-1">Direct</span>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-bold text-gray-800 dark:text-gray-200">{bus.arrival}</p>
                                    </div>
                                </div>
                                
                                <div className="text-center md:text-right w-full md:w-32 border-t md:border-t-0 border-l-0 md:border-l border-gray-200 dark:border-gray-700 pt-4 md:pt-0 md:pl-6">
                                    <p className="text-xs text-green-600 dark:text-green-400 font-bold mb-1">{bus.seats} seats available</p>
                                    <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-3">₹{bus.price}</h2>
                                    <Button onClick={() => Swal.fire('Coming Soon', 'Booking functionality coming soon via Gateway!', 'info')} className="w-full bg-primary hover:bg-blue-800"><FaTicketAlt className="inline mr-2"/> Book Seat</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BusTickets;
