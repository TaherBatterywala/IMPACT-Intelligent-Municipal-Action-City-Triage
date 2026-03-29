import React, { useEffect } from 'react';

const GoogleTranslate = () => {
    useEffect(() => {
        // Only load the script if it hasn't been loaded yet
        if (!document.getElementById('google-translate-script')) {
            window.googleTranslateElementInit = () => {
                if (window.google && window.google.translate) {
                    new window.google.translate.TranslateElement({
                        pageLanguage: 'en',
                        includedLanguages: 'hi,bn,te,mr,ta,gu,kn,ml,pa,or,as,ur,en',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
                    }, 'google_translate_element');
                }
            };
            
            const addScript = document.createElement('script');
            addScript.id = 'google-translate-script';
            addScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            document.body.appendChild(addScript);
        } else if (window.googleTranslateElementInit) {
            // If returning to a page where the script is already loaded
            if (document.getElementById('google_translate_element') && document.getElementById('google_translate_element').innerHTML === '') {
                 // Try re-initializing if the div is empty
                 try {
                     window.googleTranslateElementInit();
                 } catch (e) {
                     console.error(e);
                 }
            }
        }
    }, []);

    return (
        <div id="google_translate_element"></div>
    );
};

export default GoogleTranslate;
