import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      "Welcome": "Welcome",
      "Login": "Login",
      "Officer Login": "Officer Login",
      "Profile": "Profile",
      "Logout": "Logout",
      "File a Complaint": "File a Complaint",
      "Water": "Water",
      "Roads": "Roads",
      "Sanitation": "Sanitation",
      "Electricity": "Electricity",
      "Health": "Health",
      "Select Sub-Category for": "Select Sub-Category for",
      "Select Issue Type": "Select Issue Type",
      "Other": "Other",
      "Name your issue": "Name your issue",
      "Details & Location": "Details & Location",
      "Describe the issue in detail...": "Describe the issue in detail...",
      "Location (Ward/Area)": "Location (Ward/Area)",
      "Back": "Back",
      "Next": "Next",
      "Confirm Submission": "Confirm Submission",
      "Category:": "Category:",
      "Issue:": "Issue:",
      "Location:": "Location:",
      "Description:": "Description:",
      "Submit Complaint": "Submit Complaint",
      // Issues mapping translations
      "Leakage": "Leakage",
      "No Supply": "No Supply",
      "Contaminated/Polluted": "Contaminated/Polluted",
      "Low Pressure": "Low Pressure",
      "Pipe Burst": "Pipe Burst",
      "Pothole": "Pothole",
      "Damaged Road": "Damaged Road",
      "Waterlogging": "Waterlogging",
      "Faded Markings": "Faded Markings",
      "Garbage Accumulation": "Garbage Accumulation",
      "Dead Animal": "Dead Animal",
      "Blocked Drain": "Blocked Drain",
      "Public Toilet Issue": "Public Toilet Issue",
      "Power Outage": "Power Outage",
      "Broken Streetlight": "Broken Streetlight",
      "Sparking Wire": "Sparking Wire",
      "Fallen Pole": "Fallen Pole",
      "Stray Animal Problem": "Stray Animal Problem",
      "Mosquito Breeding": "Mosquito Breeding",
      "Illegal Clinic": "Illegal Clinic",
      "Food Quality Concern": "Food Quality Concern",
    }
  },
  hi: {
    translation: {
      "Welcome": "स्वागत है",
      "Login": "लॉग इन",
      "Officer Login": "अधिकारी लॉग इन",
      "Profile": "प्रोफ़ाइल",
      "Logout": "लॉग आउट",
      "File a Complaint": "शिकायत दर्ज करें",
      "Water": "पानी",
      "Roads": "सड़कें",
      "Sanitation": "स्वच्छता",
      "Electricity": "बिजली",
      "Health": "स्वास्थ्य",
      "Select Sub-Category for": "के लिए उप-श्रेणी चुनें",
      "Select Issue Type": "समस्या का प्रकार चुनें",
      "Other": "अन्य",
      "Name your issue": "अपनी समस्या का नाम दें",
      "Details & Location": "विवरण और स्थान",
      "Describe the issue in detail...": "समस्या का विस्तार से वर्णन करें...",
      "Location (Ward/Area)": "स्थान (वार्ड/क्षेत्र)",
      "Back": "पीछे",
      "Next": "अगला",
      "Confirm Submission": "जमा करने की पुष्टि करें",
      "Category:": "श्रेणी:",
      "Issue:": "समस्या:",
      "Location:": "स्थान:",
      "Description:": "विवरण:",
      "Submit Complaint": "शिकायत जमा करें",
      // Issues
      "Leakage": "रिसाव",
      "No Supply": "आपूर्ति नहीं",
      "Contaminated/Polluted": "दूषित/प्रदूषित",
      "Low Pressure": "कम दबाव",
      "Pipe Burst": "पाइप फटना",
      "Pothole": "गड्ढा",
      "Damaged Road": "क्षतिग्रस्त सड़क",
      "Waterlogging": "जलभराव",
      "Faded Markings": "फीके निशान",
      "Garbage Accumulation": "कचरा जमा होना",
      "Dead Animal": "मृत जानवर",
      "Blocked Drain": "अवरुद्ध नाली",
      "Public Toilet Issue": "सार्वजनिक शौचालय की समस्या",
      "Power Outage": "बिजली कटौती",
      "Broken Streetlight": "टूटी हुई स्ट्रीटलाइट",
      "Sparking Wire": "चिंगारी वाला तार",
      "Fallen Pole": "गिरा हुआ खंभा",
      "Stray Animal Problem": "आवारा पशु की समस्या",
      "Mosquito Breeding": "मच्छर प्रजनन",
      "Illegal Clinic": "अवैध क्लिनिक",
      "Food Quality Concern": "भोजन की गुणवत्ता की चिंता",
    }
  },
  te: { // Telugu (Basic translation)
    translation: {
      "Welcome": "స్వాగతం",
      "Login": "లాగిన్",
      "File a Complaint": "ఫిర్యాదు చేయండి",
      "Water": "నీరు",
      "Roads": "రోడ్లు",
      "Sanitation": "పారిశుద్ధ్యం",
      "Electricity": "విద్యుత్",
      "Health": "ఆరోగ్యం"
    }
  },
  mr: { // Marathi
    translation: {
      "Welcome": "स्वागत आहे",
      "Login": "लॉगिन",
      "File a Complaint": "तक्रार नोंदवा",
      "Water": "पाणी",
      "Roads": "रस्ते",
      "Sanitation": "स्वच्छता",
      "Electricity": "वीज",
      "Health": "आरोग्य"
    }
  },
  ta: { // Tamil
    translation: {
      "Welcome": "வரவேற்பு",
      "Login": "உள்நுழை",
      "File a Complaint": "புகார் அளி",
      "Water": "நீர்",
      "Roads": "சாலைகள்",
      "Sanitation": "சுகாதாரம்",
      "Electricity": "மின்சாரம்",
      "Health": "சுகாதாரம்"
    }
  },
  bn: { // Bengali
    translation: {
      "Welcome": "স্বাগতম",
      "Login": "লগইন",
      "File a Complaint": "অভিযোগ দায়ের করুন",
      "Water": "জল",
      "Roads": "রাস্তা",
      "Sanitation": "স্বাছ্য",
      "Electricity": "বিদ্যুৎ",
      "Health": "স্বাস্থ্য"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

export default i18n;
