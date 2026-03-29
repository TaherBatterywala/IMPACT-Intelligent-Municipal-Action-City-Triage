import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, type = 'text', className, ...props }) => {
    return (
        <div className="relative mb-4">
            <input
                type={type}
                className={twMerge(
                    "peer w-full border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-0",
                    className
                )}
                placeholder=" "
                {...props}
            />
            <label className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:start-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-primary">
                {label}
            </label>
        </div>
    );
};

export default Input;
