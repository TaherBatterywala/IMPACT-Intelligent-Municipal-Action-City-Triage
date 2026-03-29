import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

const NewsSlider = () => {
    const { user } = useAuth();
    const [newsItems, setNewsItems] = useState([
        { id: 1, title: "Fetching live civic updates...", date: "Just now" }
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const city = user?.city || 'Indore';
                const res = await API.get(`/news/${city}`);
                const data = res.data;
                
                if (data && data.articles && data.articles.length > 0) {
                    const formattedNews = data.articles.slice(0, 5).map((article, idx) => ({
                        id: idx,
                        title: article.title,
                        date: new Date(article.publishedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                    }));
                    setNewsItems(formattedNews);
                } else {
                    throw new Error("No articles");
                }
            } catch (err) {
                console.error("News fetch failed, using fallback:", err);
                setNewsItems([
                    { id: 1, title: "New Municipal Budget Approved for Local Infrastructure Expansion across Districts", date: "2 Hours ago" },
                    { id: 2, title: "City-Wide Cleanliness Drive Starts Tomorrow in Ward 4", date: "5 Hours ago" },
                    { id: 3, title: "Smart Traffic Management System Installed at Major City Junctions", date: "1 Day ago" },
                    { id: 4, title: "Local Elections Witness Record Voter Turnout This Morning", date: "2 Days ago" }
                ]);
            }
        };

        fetchNews();
    }, [user?.city]);

    useEffect(() => {
        if (newsItems.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % newsItems.length);
        }, 7000);
        return () => clearInterval(timer);
    }, [newsItems.length]);

    const currentCity = user?.city || 'Indore';

    return (
        <div className="relative w-full h-64 md:h-72 bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-200 mb-10 group flex flex-col">
            
            {/* Top Stat Bar - Fixed Position so nothing bounces */}
            <div className="flex justify-between items-center px-6 md:px-10 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 z-20">
                <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-primary">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    Civic Feed: {currentCity}
                </div>
                <div className="text-gray-500 dark:text-gray-400 text-xs md:text-sm font-medium">
                    {newsItems[currentIndex]?.date}
                </div>
            </div>

            {/* Slider Content */}
            <div className="flex-1 relative overflow-hidden">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="absolute inset-0 flex flex-col justify-center px-6 md:px-16"
                    >
                        <h3 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white line-clamp-3 leading-tight tracking-tight">
                            {newsItems[currentIndex]?.title}
                        </h3>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Pagination */}
            {newsItems.length > 1 && (
                <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-30 pointer-events-auto">
                    {newsItems.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-gray-300 dark:bg-gray-600 hover:bg-primary/50'}`}
                            aria-label={`Article ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default NewsSlider;
