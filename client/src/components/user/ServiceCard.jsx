import React from 'react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon: Icon, title, link, color, onClick }) => {
    const content = (
        <div
            className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer h-full border-b-4 ${color}`}
            onClick={onClick}
        >
            <div className={`p-4 rounded-full bg-gray-50 dark:bg-gray-700 mb-4 text-3xl ${color.replace('border-', 'text-')}`}>
                <Icon />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-center">{title}</h3>
        </div>
    );

    return link ? <Link to={link} className="block h-full">{content}</Link> : content;
};

export default ServiceCard;
