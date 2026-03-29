import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const StatsCard = ({ title, value, icon: Icon, color = 'bg-white', textColor = 'text-gray-800' }) => {
    return (
        <div className={twMerge("p-6 rounded-2xl shadow-lg flex items-center justify-between transition-transform hover:scale-105", color)}>
            <div>
                <p className={twMerge("text-sm font-medium mb-1 opacity-80", textColor)}>{title}</p>
                <h3 className={twMerge("text-3xl font-bold", textColor)}>{value}</h3>
            </div>
            {Icon && (
                <div className={twMerge("p-3 rounded-full bg-white/20 backdrop-blur-sm", textColor)}>
                    <Icon size={24} />
                </div>
            )}
        </div>
    );
};

export default StatsCard;
