import React, { useState, useEffect } from 'react';

const LanguageSwitcher = () => {
    const [selectedLang, setSelectedLang] = useState('en');

    useEffect(() => {
        // Parse the googtrans cookie to set initial state
        const match = document.cookie.match(/(^|;) ?googtrans=([^;]*)(;|$)/);
        if (match) {
            const langMatch = match[2];
            if (langMatch) {
                const parts = langMatch.split('/');
                const lang = parts[parts.length - 1];
                if (lang) {
                    setSelectedLang(lang);
                }
            }
        }
    }, []);

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLang(lang);
        
        const selectElement = document.querySelector('.goog-te-combo');
        if (selectElement) {
            selectElement.value = lang;
            selectElement.dispatchEvent(new Event('change'));
        } else {
            // Fallback if the widget hasn't fully loaded
            if (lang === 'en') {
                document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${window.location.hostname}; path=/;`;
            } else {
                const cookieValue = `/en/${lang}`;
                document.cookie = `googtrans=${cookieValue}; path=/`;
                document.cookie = `googtrans=${cookieValue}; domain=${window.location.hostname}; path=/`;
            }
            window.location.reload();
        }
    };

    return (
        <select 
            value={selectedLang} 
            onChange={handleLanguageChange}
            className="p-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer hover:border-primary transition-colors font-medium"
        >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="pa">ਪੰਜਾਬी (Punjabi)</option>
            <option value="ur">اردو (Urdu)</option>
            <option value="as">অসমীয়া (Assamese)</option>
            <option value="or">ଓଡ଼ିଆ (Odia)</option>
        </select>
    );
};

export default LanguageSwitcher;
