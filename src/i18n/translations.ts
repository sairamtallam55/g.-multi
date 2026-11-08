import type { Language } from '../types';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    appName: 'GODAVARI SAHAAYA',
    appSub: 'PS-04',
    appTagline: 'Your Smart Companion for Godavari Pushkaralu 2027',
    demoBadge: 'DEMO DATA — NOT OFFICIAL',
    demoNotice: 'All schedules, facilities, and advisories shown are demonstration planning records for Pushkaralu 2027.',
    
    // Nav
    navHome: 'Home',
    navAssistant: 'AI Assistant',
    navFacilities: 'Facility Finder',
    navGhats: 'Bathing Ghats',
    navMedical: 'Medical Help',
    navTransport: 'Transport & Parking',
    navAnnouncements: 'Announcements',
    navEmergency: 'Emergency 112',
    navLostFound: 'Lost & Found',
    navOffline: 'Offline Guide',
    navFeedback: 'Feedback',
    navAdmin: 'Admin Panel',
    navAbout: 'About Project',

    // Quick Action Cards
    quickGhats: 'Bathing Ghats',
    quickMedical: 'Hospitals & Camps',
    quickWater: 'Drinking Water',
    quickToilets: 'Public Toilets',
    quickPolice: 'Police & Help Desks',
    quickTransport: 'Bus Transit',
    quickParking: 'Parking Zones',
    quickAccess: 'Accessibility & Buggy',

    // Search
    searchPlaceholder: 'Search bathing ghats, hospitals, water points, parking, help desks...',
    searchButton: 'Search',
    clearFilters: 'Clear Filters',
    allCategories: 'All Categories',
    allLocalities: 'All Localities',

    // Verification
    statusVerified: 'VERIFIED',
    statusUnverified: 'UNVERIFIED',
    statusDemo: 'DEMO DATA',

    // AI Assistant
    aiTitle: 'Godavari Sahaaya AI Pilgrim Assistant',
    aiSubtitle: 'Multilingual assistance powered by Gemini & Grounded Pushkaralu Knowledge Base',
    aiInputPlaceholder: 'Ask in English, Telugu, or Hindi (e.g. Where is Pushkar Ghat?)...',
    aiSend: 'Send',
    aiSuggested: 'Frequently Asked Questions',
    aiClear: 'Clear Conversation',
    aiSpeak: 'Voice Input',
    aiListen: 'Listen (Audio)',
    aiSource: 'Source Reference',
    aiFallbackActive: 'Deterministic Offline Fallback Active',

    // Facility Details
    directions: 'Open Directions',
    contact: 'Contact',
    verifiedSource: 'Verified Source',
    capacity: 'Estimated Capacity',
    accessibility: 'Accessibility Features',
    viewOnMap: 'View on Map',
    viewAsList: 'View as List',
    locationPermission: 'Use My Current Location',

    // Emergency
    emergencyHeader: 'Immediate Emergency Assistance (Dial 112)',
    emergencySub: 'One-touch national helpline for Police, Medical Ambulance 108, Fire, and State Disaster Response.',
    callNow: 'Call 112 Now',
    call108: 'Call 108 Ambulance',
    callChildline: 'Call 1098 Childline',

    // Forms
    submit: 'Submit Report',
    submitting: 'Submitting...',
    name: 'Your Name',
    contactInfo: 'Contact Phone Number (Confidential)',
    description: 'Detailed Description',
    location: 'Approximate Location / Ghat',
    date: 'Date & Time',
    category: 'Category',

    // Offline
    offlineTitle: 'Offline Pilgrim Guide & Cache',
    offlineSub: 'Essential guides, emergency numbers, and key facilities remain accessible without mobile internet.',
    offlineCachedReady: 'Application Shell & Essential Guides are Cached on Device',
    refreshCache: 'Sync Updates When Online',

    // Admin
    adminTitle: 'Godavari Sahaaya Administrative Command',
    adminLoginPrompt: 'Authorized Administrator Sign In',
    login: 'Sign In',
    logout: 'Sign Out',
    totalFacilities: 'Total Facilities',
    verifiedFacilities: 'Verified Facilities',
    demoFacilities: 'Demo Facilities',
    addFacility: 'Add New Facility',
    addAnnouncement: 'Post Announcement',
    addFaq: 'Add FAQ',
    resetSeed: 'Reset Demo Database'
  },
  te: {
    appName: 'గోదావరి సహాయ',
    appSub: 'PS-04',
    appTagline: 'గోదావరి పుష్కరాలు 2027 మీ స్మార్ట్ సహచరి',
    demoBadge: 'డెమో సమాచారం — అధికారికం కాదు',
    demoNotice: 'ఇందులో చూపబడిన సమాచారం పుష్కరాలు 2027 ప్రణాళిక ప్రదర్శన కొరకు మాత్రమే.',

    // Nav
    navHome: 'హోమ్',
    navAssistant: 'AI సహాయకుడు',
    navFacilities: 'సదుపాయాల గుర్తింపు',
    navGhats: 'స్నాన ఘాట్లు',
    navMedical: 'వైద్య సహాయం',
    navTransport: 'రవాణా & పార్కింగ్',
    navAnnouncements: 'ప్రకటనలు & హెచ్చరికలు',
    navEmergency: 'అత్యవసరం 112',
    navLostFound: 'తప్పిపోయిన & దొరికినవి',
    navOffline: 'ఆఫ్‌లైన్ గైడ్',
    navFeedback: 'అభిప్రాయం',
    navAdmin: 'అడ్మిన్ ప్యానెల్',
    navAbout: 'ప్రాజెక్ట్ గురించి',

    // Quick Action Cards
    quickGhats: 'స్నాన ఘాట్లు',
    quickMedical: 'ఆసుపత్రులు & వైద్యం',
    quickWater: 'మంచినీటి పాయింట్లు',
    quickToilets: 'పబ్లిక్ టాయిలెట్లు',
    quickPolice: 'పోలీస్ & హెల్ప్ డెస్కులు',
    quickTransport: 'ఆర్టీసీ బస్సులు',
    quickParking: 'పార్కింగ్ స్థలాలు',
    quickAccess: 'దివ్యాంగుల వాహనాలు',

    // Search
    searchPlaceholder: 'ఘాట్లు, ఆసుపత్రులు, తాగునీరు, పార్కింగ్ కోసం వెతకండి...',
    searchButton: 'వెతకండి',
    clearFilters: 'ఫిల్టర్లు తొలగించు',
    allCategories: 'అన్ని విభాగాలు',
    allLocalities: 'అన్ని ప్రాంతాలు',

    // Verification
    statusVerified: 'ధృవీకరించబడింది',
    statusUnverified: 'ధృవీకరించబడలేదు',
    statusDemo: 'డెమో డేటా',

    // AI Assistant
    aiTitle: 'గోదావరి సహాయ AI యాత్రికుల అసిస్టెంట్',
    aiSubtitle: 'జెమిని AI మరియు పుష్కరాల నాలెడ్జ్ బేస్ ఆధారిత బహుభాషా సహాయం',
    aiInputPlaceholder: 'తెలుగు, ఇంగ్లీష్ లేదా హిందీలో అడగండి (ఉదా: పుష్కర్ ఘాట్ ఎక్కడ ఉంది?)...',
    aiSend: 'పంపండి',
    aiSuggested: 'తరచుగా అడిగే ప్రశ్నలు',
    aiClear: 'సంభాషణ క్లియర్ చేయి',
    aiSpeak: 'వాయిస్ ద్వారా అడగండి',
    aiListen: 'వినండి (ఆడియో)',
    aiSource: 'ఆధార సమాచారం',
    aiFallbackActive: 'ఆఫ్‌లైన్ స్థానిక శోధన యాక్టివ్‌గా ఉంది',

    // Facility Details
    directions: 'మార్గం చూడండి (మ్యాప్)',
    contact: 'సంప్రదించండి',
    verifiedSource: 'సమాచార ఆధారం',
    capacity: 'అంచనా సామర్థ్యం',
    accessibility: 'ప్రత్యేక సదుపాయాలు',
    viewOnMap: 'మ్యాప్‌లో చూడండి',
    viewAsList: 'జాబితాగా చూడండి',
    locationPermission: 'నా ప్రస్తుత స్థానాన్ని గుర్తించు',

    // Emergency
    emergencyHeader: 'తక్షణ అత్యవసర సహాయం (డయల్ 112)',
    emergencySub: 'పోలీస్, 108 అంబులెన్స్, అగ్నిమాపక, విపత్తు నివారణ కోసం ఒకే ఉచిత నంబర్.',
    callNow: '112 కు కాల్ చేయండి',
    call108: '108 అంబులెన్స్',
    callChildline: '1098 చైల్డ్‌లైన్',

    // Forms
    submit: 'సమర్పించండి',
    submitting: 'పంపుతోంది...',
    name: 'మీ పేరు',
    contactInfo: 'సంప్రదింపు ఫోన్ నంబర్ (గోప్యంగా ఉంటుంది)',
    description: 'పూర్తి వివరాలు',
    location: 'ప్రదేశం / సమీప ఘాట్',
    date: 'తేదీ & సమయం',
    category: 'విభాగం',

    // Offline
    offlineTitle: 'ఆఫ్‌లైన్ యాత్రికుల మార్గదర్శిని',
    offlineSub: 'ఇంటర్నెట్ లేకపోయినా అత్యవసర నంబర్లు, భద్రతా సూచనలు ఫోన్‌లో అందుబాటులో ఉంటాయి.',
    offlineCachedReady: 'ముఖ్యమైన సమాచారం మీ ఫోన్‌లో భద్రపరచబడింది',
    refreshCache: 'నెట్ వచ్చినప్పుడు తాజా సమాచారాన్ని పొందండి',

    // Admin
    adminTitle: 'గోదావరి సహాయ అడ్మిన్ కార్యాలయం',
    adminLoginPrompt: 'నిర్వాహకుల లాగిన్',
    login: 'లాగిన్ అవ్వండి',
    logout: 'లాగౌట్',
    totalFacilities: 'మొత్తం సదుపాయాలు',
    verifiedFacilities: 'ధృవీకరించినవి',
    demoFacilities: 'డెమో సదుపాయాలు',
    addFacility: 'కొత్త సదుపాయాన్ని జోడించు',
    addAnnouncement: 'ప్రకటన విడుదల చేయి',
    addFaq: 'FAQ జోడించు',
    resetSeed: 'డెమో డేటాను పునరుద్ధరించు'
  },
  hi: {
    appName: 'गोदावरी सहाय',
    appSub: 'PS-04',
    appTagline: 'गोदावरी पुष्करालु 2027 आपका स्मार्ट साथी',
    demoBadge: 'डेमो डेटा — आधिकारिक नहीं',
    demoNotice: 'प्रदर्शित सभी कार्यक्रम, सुविधाएं और निर्देश पुष्करालु 2027 योजना के प्रदर्शन रिकॉर्ड हैं।',

    // Nav
    navHome: 'होम',
    navAssistant: 'एआई सहायक',
    navFacilities: 'सुविधा खोज',
    navGhats: 'स्नान घाट',
    navMedical: 'चिकित्सा सहायता',
    navTransport: 'परिवहन व पार्किंग',
    navAnnouncements: 'घोषणाएं व अलर्ट',
    navEmergency: 'आपातकालीन 112',
    navLostFound: 'खोया-पाया',
    navOffline: 'ऑफलाइन गाइड',
    navFeedback: 'प्रतिक्रिया',
    navAdmin: 'एडमिन पैनल',
    navAbout: 'परियोजना परिचय',

    // Quick Action Cards
    quickGhats: 'स्नान घाट',
    quickMedical: 'अस्पताल व शिविर',
    quickWater: 'पीने का पानी',
    quickToilets: 'सार्वजनिक शौचालय',
    quickPolice: 'पुलिस व हेल्प डेस्क',
    quickTransport: 'बस सेवा',
    quickParking: 'वाहन पार्किंग',
    quickAccess: 'दिव्यांग व वरिष्ठ सहायता',

    // Search
    searchPlaceholder: 'घाट, अस्पताल, पेयजल, शौचालय, पार्किंग खोजें...',
    searchButton: 'खोजें',
    clearFilters: 'फ़िल्टर हटाएं',
    allCategories: 'सभी श्रेणियां',
    allLocalities: 'सभी क्षेत्र',

    // Verification
    statusVerified: 'सत्यापित',
    statusUnverified: 'असत्यापित',
    statusDemo: 'डेमो डेटा',

    // AI Assistant
    aiTitle: 'गोदावरी सहाय एआई तीर्थयात्री सहायक',
    aiSubtitle: 'जेमिनी एआई और प्रमाणित पुष्करालु ज्ञानकोष द्वारा संचालित बहुभाषी सहायता',
    aiInputPlaceholder: 'हिंदी, तेलुगु या अंग्रेजी में पूछें (उदा: पुष्कर घाट कहाँ है?)...',
    aiSend: 'भेजें',
    aiSuggested: 'अक्सर पूछे जाने वाले प्रश्न',
    aiClear: 'वार्तालाप मिटाएं',
    aiSpeak: 'बोलकर पूछें',
    aiListen: 'ऑडियो सुनें',
    aiSource: 'स्रोत संदर्भ',
    aiFallbackActive: 'स्थानीय ऑफलाइन फॉलबैक सक्रिय है',

    // Facility Details
    directions: 'रास्ता देखें (मानचित्र)',
    contact: 'संपर्क',
    verifiedSource: 'सत्यापित स्रोत',
    capacity: 'अनुमानित क्षमता',
    accessibility: 'सुलभता सुविधाएं',
    viewOnMap: 'मानचित्र पर देखें',
    viewAsList: 'सूची के रूप में देखें',
    locationPermission: 'मेरा वर्तमान स्थान उपयोग करें',

    // Emergency
    emergencyHeader: 'तत्काल आपातकालीन सहायता (डायल 112)',
    emergencySub: 'पुलिस, 108 एम्बुलेंस, अग्निशमन और राज्य आपदा राहत बल के लिए राष्ट्रीय हेल्पलाइन।',
    callNow: '112 पर तुरंत कॉल करें',
    call108: '108 एम्बुलेंस',
    callChildline: '1098 चाइल्डलाइन',

    // Forms
    submit: 'रिपोर्ट जमा करें',
    submitting: 'जमा हो रहा है...',
    name: 'आपका नाम',
    contactInfo: 'संपर्क फोन नंबर (गोपनीय रहेगा)',
    description: 'विस्तृत विवरण',
    location: 'स्थान / निकटतम घाट',
    date: 'दिनांक व समय',
    category: 'श्रेणी',

    // Offline
    offlineTitle: 'ऑफलाइन तीर्थयात्री गाइड',
    offlineSub: 'इंटरनेट न होने पर भी आपातकालीन नंबर, सुरक्षा दिशानिर्देश फोन पर उपलब्ध रहेंगे।',
    offlineCachedReady: 'महत्वपूर्ण जानकारी आपके फोन में सुरक्षित संग्रहित है',
    refreshCache: 'इंटरनेट चालू होने पर अपडेट करें',

    // Admin
    adminTitle: 'गोदावरी सहाय प्रशासनिक नियंत्रण',
    adminLoginPrompt: 'अधिकृत प्रशासक लॉगिन',
    login: 'लॉगिन करें',
    logout: 'लॉगआउट',
    totalFacilities: 'कुल सुविधाएं',
    verifiedFacilities: 'सत्यापित',
    demoFacilities: 'डेमो सुविधाएं',
    addFacility: 'नई सुविधा जोड़ें',
    addAnnouncement: 'घोषणा जारी करें',
    addFaq: 'एफएक्यू जोड़ें',
    resetSeed: 'डेमो डेटा रीसेट करें'
  }
};
