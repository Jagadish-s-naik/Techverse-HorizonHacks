interface TranslationMap {
  [key: string]: {
    forecastFor: string;
    in: string;
    expectedPriceIs: string;
    to: string;
    rupeesPerKg: string;
    trendIs: string;
    up: string;
    down: string;
    stable: string;
    confidenceIs: string;
    percent: string;
    keyFactors: string;
    hold: string;
    sell: string;
    moderate: string;
    high: string;
    low: string;
    safe: string;
    risky: string;
    hello: string;
    communitySignal: string;
    farmersInYourDistrict: string;
    thisSeason: string;
    listen: string;
    checkAccuracy: string;
    decisionRecommendation: string;
    whyRecommendThis: string;
    alternativeAction: string;
    iUnderstand: string;
    standard: string;
    simple: string;
    offlineMessage: string;
    syncingMessage: string;
    tapToViewDecision: string;
    trackRecord: string;
    reliableInsights: string;
    accuracyDesc: string;
    priceHistory: string;
    predicted: string;
    actual: string;
    waitingMarketData: string;
    close: string;
    setupProfile: string;
    step: string;
    of: string;
    chooseCrop: string;
    landSize: string;
    acres: string;
    irrigationQuestion: string;
    storageQuestion: string;
    selectMandi: string;
    selectLanguage: string;
    back: string;
    next: string;
    finish: string;
    yourProfile: string;
    cropMarket: string;
    primaryCrop: string;
    nearestMandi: string;
    preferences: string;
    language: string;
    simpleMode: string;
    infrastructure: string;
    irrigationAvailable: string;
    storageAvailable: string;
    saveChanges: string;
    resetProfile: string;
    risk: string;
    accuracy: string;
    expectedPriceRange: string;
    keyPriceDrivers: string;
    howAccurate: string;
    smsUpdate: string;
    smsFallbackLabel: string;
    adviceLabel: string;
    whyLabel: string;
    replyHelp: string;
    mandiLabel: string;
    insufficientData: string;
    livePrice: string;
    // Recommendation keys
    REC_HOLD_STORAGE_ACTION: string;
    REC_HOLD_STORAGE_RATIONALE: string;
    REC_HOLD_STORAGE_ALT: string;
    REC_SELL_NO_STORAGE_ACTION: string;
    REC_SELL_NO_STORAGE_RATIONALE: string;
    REC_SELL_NO_STORAGE_ALT: string;
    REC_SPLIT_VOLATILE_ACTION: string;
    REC_SPLIT_VOLATILE_RATIONALE: string;
    REC_SPLIT_VOLATILE_ALT: string;
    REC_MONITOR_UNCLEAR_ACTION: string;
    REC_MONITOR_UNCLEAR_RATIONALE: string;
    REC_MONITOR_UNCLEAR_ALT: string;
  };
}

export const translations: TranslationMap = {
  English: {
    forecastFor: "Forecast for",
    in: "in",
    expectedPriceIs: "Expected price is between",
    to: "and",
    rupeesPerKg: "rupees per kilogram",
    trendIs: "The trend is",
    up: "increasing",
    down: "decreasing",
    stable: "stable",
    confidenceIs: "Confidence is",
    percent: "percent",
    keyFactors: "Key factors",
    hold: "Hold",
    sell: "Sell",
    moderate: "moderate",
    high: "high",
    low: "low",
    safe: "safe",
    risky: "risky",
    hello: "Hello",
    communitySignal: "Community Signal",
    farmersInYourDistrict: "farmers in your district plan to grow",
    thisSeason: "this season",
    listen: "Listen",
    checkAccuracy: "Check Accuracy",
    decisionRecommendation: "Decision Recommendation",
    whyRecommendThis: "Why we recommend this",
    alternativeAction: "Alternative Action",
    iUnderstand: "I understand",
    standard: "Standard",
    simple: "Simple",
    offlineMessage: "You are currently offline. Showing cached data.",
    syncingMessage: "Syncing pending changes...",
    tapToViewDecision: "Tap to view recommended decision",
    trackRecord: "Track Record",
    reliableInsights: "Reliable Insights",
    accuracyDesc: "of our price forecasts were accurate within the predicted band in the last 30 days.",
    priceHistory: "Price History",
    predicted: "Predicted",
    actual: "Actual",
    waitingMarketData: "Waiting for market data...",
    close: "Close",
    setupProfile: "Setup your profile",
    step: "Step",
    of: "of",
    chooseCrop: "Choose your primary crop",
    landSize: "What is your land size (acres)?",
    acres: "Acres",
    irrigationQuestion: "Do you have irrigation?",
    storageQuestion: "Do you have storage?",
    selectMandi: "Select your nearest mandi",
    selectLanguage: "Select your language",
    back: "Back",
    next: "Next",
    finish: "Finish",
    yourProfile: "Your Profile",
    cropMarket: "Crop & Market",
    primaryCrop: "Primary Crop",
    nearestMandi: "Nearest Mandi",
    preferences: "Preferences",
    language: "Language",
    simpleMode: "Simple Mode (SMS-style)",
    infrastructure: "Infrastructure",
    irrigationAvailable: "Irrigation Available",
    storageAvailable: "Storage Available",
    saveChanges: "Save Changes",
    resetProfile: "Reset Profile",
    risk: "RISK",
    accuracy: "Accuracy",
    expectedPriceRange: "Expected Price (7-14 days)",
    keyPriceDrivers: "Key Price Drivers",
    howAccurate: "How accurate are we? View track record",
    smsUpdate: "FarmSight Update",
    smsFallbackLabel: "Now • SMS Fallback Mode",
    adviceLabel: "ADVICE",
    whyLabel: "WHY",
    replyHelp: "Reply 'HELP' for more info",
    mandiLabel: "Mandi",
    insufficientData: "Market data for this crop is currently limited. Please check back in a few days or try a different market.",
    livePrice: "Live Price",
    REC_HOLD_STORAGE_ACTION: "Hold — wait 5–7 days before selling",
    REC_HOLD_STORAGE_RATIONALE: "Prices are trending up with high confidence, and your storage allows you to wait for a better peak.",
    REC_HOLD_STORAGE_ALT: "If you need immediate cash, sell only 30% of your stock now.",
    REC_SELL_NO_STORAGE_ACTION: "Sell now at current market price",
    REC_SELL_NO_STORAGE_RATIONALE: "Market supply is increasing. Without storage, holding risks quality loss and lower prices later.",
    REC_SELL_NO_STORAGE_ALT: "Check nearby mandis for a ±₹2/kg difference before committing.",
    REC_SPLIT_VOLATILE_ACTION: "Sell 50% now, hold 50%",
    REC_SPLIT_VOLATILE_RATIONALE: "The market shows upward potential but is volatile. Splitting your stock reduces your risk.",
    REC_SPLIT_VOLATILE_ALT: "Wait 2 days to see if the trend stabilizes before selling the rest.",
    REC_MONITOR_UNCLEAR_ACTION: "Monitor daily — market is unclear",
    REC_MONITOR_UNCLEAR_RATIONALE: "Current indicators are mixed. Avoid large sells until a clearer trend emerges.",
    REC_MONITOR_UNCLEAR_ALT: "Focus on harvest quality to ensure top-tier pricing when you do sell.",
  },
  Hindi: {
    forecastFor: "पूर्वानुमान",
    in: "में",
    expectedPriceIs: "अपेक्षित मूल्य",
    to: "से",
    rupeesPerKg: "रुपये प्रति किलोग्राम के बीच है",
    trendIs: "रुझान",
    up: "बढ़ रहा है",
    down: "घट रहा है",
    stable: "स्थिर है",
    confidenceIs: "विश्वास स्तर",
    percent: "प्रतिशत है",
    keyFactors: "मुख्य कारक",
    hold: "रोकें",
    sell: "बेचें",
    moderate: "मध्यम",
    high: "उच्च",
    low: "कम",
    safe: "सुरक्षित",
    risky: "जोखिम भरा",
    hello: "नमस्ते",
    communitySignal: "सामुदायिक संकेत",
    farmersInYourDistrict: "आपके जिले के किसान इस सीजन में",
    thisSeason: "उगाने की योजना बना रहे हैं",
    listen: "सुनें",
    checkAccuracy: "सटीकता जांचें",
    decisionRecommendation: "निर्णय अनुशंसा",
    whyRecommendThis: "हम इसकी अनुशंसा क्यों करते हैं",
    alternativeAction: "वैकल्पिक कार्रवाई",
    iUnderstand: "मैं समझता हूँ",
    standard: "मानक",
    simple: "सरल",
    offlineMessage: "आप अभी ऑफ़लाइन हैं। कैश्ड डेटा दिखा रहे हैं।",
    syncingMessage: "लंबित परिवर्तनों को सिंक कर रहा है...",
    tapToViewDecision: "अनुशंसित निर्णय देखने के लिए टैप करें",
    trackRecord: "ट्रैक रिकॉर्ड",
    reliableInsights: "विश्वसनीय अंतर्दृष्टि",
    accuracyDesc: "पिछले 30 दिनों में हमारे मूल्य पूर्वानुमान सटीक रहे हैं।",
    priceHistory: "मूल्य इतिहास",
    predicted: "पूर्वानुमानित",
    actual: "वास्तविक",
    waitingMarketData: "बाजार डेटा की प्रतीक्षा है...",
    close: "बंद करें",
    setupProfile: "अपनी प्रोफाइल सेट करें",
    step: "चरण",
    of: "का",
    chooseCrop: "अपनी मुख्य फसल चुनें",
    landSize: "आपकी भूमि का आकार क्या है (एकड़)?",
    acres: "एकड़",
    irrigationQuestion: "क्या आपके पास सिंचाई की सुविधा है?",
    storageQuestion: "क्या आपके पास भंडारण की सुविधा है?",
    selectMandi: "अपनी निकटतम मंडी चुनें",
    selectLanguage: "अपनी भाषा चुनें",
    back: "पीछे",
    next: "अगला",
    finish: "समाप्त",
    yourProfile: "आपकी प्रोफाइल",
    cropMarket: "फसल और बाजार",
    primaryCrop: "मुख्य फसल",
    nearestMandi: "निकटतम मंडी",
    preferences: "प्राथमिकताएं",
    language: "भाषा",
    simpleMode: "सरल मोड (SMS-शैली)",
    infrastructure: "बुनियादी ढांचा",
    irrigationAvailable: "सिंचाई उपलब्ध",
    storageAvailable: "भंडारण उपलब्ध",
    saveChanges: "परिवर्तन सहेजें",
    resetProfile: "प्रोफाइल रीसेट करें",
    risk: "जोखिम",
    accuracy: "सटीकता",
    expectedPriceRange: "अपेक्षित मूल्य (7-14 दिन)",
    keyPriceDrivers: "मुख्य मूल्य कारक",
    howAccurate: "हम कितने सटीक हैं? ट्रैक रिकॉर्ड देखें",
    smsUpdate: "फार्मसाइट अपडेट",
    smsFallbackLabel: "अभी • SMS फ़ॉलबैक मोड",
    adviceLabel: "सलाह",
    whyLabel: "क्यों",
    replyHelp: "अधिक जानकारी के लिए 'HELP' लिखें",
    mandiLabel: "मंडी",
    insufficientData: "इस फसल के लिए बाजार डेटा अभी सीमित है। कृपया कुछ दिनों बाद दोबारा प्रयास करें या कोई अन्य मंडी चुनें।",
    livePrice: "ताजा भाव",
    REC_HOLD_STORAGE_ACTION: "रोकें — बेचने से पहले 5-7 दिन प्रतीक्षा करें",
    REC_HOLD_STORAGE_RATIONALE: "कीमतें बढ़ रही हैं और आपका भंडारण आपको बेहतर कीमतों के लिए प्रतीक्षा करने की अनुमति देता है।",
    REC_HOLD_STORAGE_ALT: "यदि आपको तत्काल नकदी की आवश्यकता है, तो अभी केवल 30% स्टॉक बेचें।",
    REC_SELL_NO_STORAGE_ACTION: "अभी बाजार मूल्य पर बेचें",
    REC_SELL_NO_STORAGE_RATIONALE: "बाजार में आपूर्ति बढ़ रही है। भंडारण के बिना, रोकने से गुणवत्ता और कीमत दोनों कम होने का जोखिम है।",
    REC_SELL_NO_STORAGE_ALT: "बेचने से पहले नजदीकी मंडियों में कीमतों के अंतर की जांच करें।",
    REC_SPLIT_VOLATILE_ACTION: "अभी 50% बेचें, 50% रोकें",
    REC_SPLIT_VOLATILE_RATIONALE: "बाजार में बढ़त की संभावना है लेकिन यह अस्थिर है। स्टॉक को विभाजित करना आपके जोखिम को कम करता है।",
    REC_SPLIT_VOLATILE_ALT: "बाकी बेचने से पहले 2 दिन प्रतीक्षा करें और देखें कि क्या रुझान स्थिर होता है।",
    REC_MONITOR_UNCLEAR_ACTION: "दैनिक निगरानी करें — बाजार स्पष्ट नहीं है",
    REC_MONITOR_UNCLEAR_RATIONALE: "वर्तमान संकेतक मिले-जुले हैं। स्पष्ट रुझान उभरने तक बड़ी बिक्री से बचें।",
    REC_MONITOR_UNCLEAR_ALT: "बेचते समय सर्वोत्तम मूल्य प्राप्त करने के लिए फसल की गुणवत्ता पर ध्यान दें।",
  },
  Kannada: {
    forecastFor: "ಮುನ್ಸೂಚನೆ",
    in: "ನಲ್ಲಿ",
    expectedPriceIs: "ನಿರೀಕ್ಷಿತ ಬೆಲೆ",
    to: "ಮತ್ತು",
    rupeesPerKg: "ರೂಪಾಯಿ ಪ್ರತಿ ಕಿಲೋಗ್ರಾಂ ನಡುವೆ ಇರುತ್ತದೆ",
    trendIs: "ಧೋರಣೆ",
    up: "ಏರುತ್ತಿದೆ",
    down: "ಇಳಿಯುತ್ತಿದೆ",
    stable: "ಸ್ಥಿರವಾಗಿದೆ",
    confidenceIs: "ಭರವಸೆಯ ಮಟ್ಟ",
    percent: "ಪ್ರತಿಶತ ಇರುತ್ತದೆ",
    keyFactors: "ಮುಖ್ಯಾಂಶಗಳು",
    hold: "ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳಿ",
    sell: "ಮಾರಿ",
    moderate: "ಮಧ್ಯಮ",
    high: "ಹೆಚ್ಚು",
    low: "ಕಡಿಮೆ",
    safe: "ಸುರಕ್ಷಿತ",
    risky: "ಅಪಾಯಕಾರಿ",
    hello: "ನಮಸ್ಕಾರ",
    communitySignal: "ಸಮುದಾಯದ ಮಾಹಿತಿ",
    farmersInYourDistrict: "ನಿಮ್ಮ ಜಿಲ್ಲೆಯ ರೈತರು",
    thisSeason: "ಈ ಹಂಗಾಮಿನಲ್ಲಿ ಬೆಳೆಯಲು ಯೋಜಿಸಿದ್ದಾರೆ",
    listen: "ಕೇಳಿ",
    checkAccuracy: "ನಿಖರತೆಯನ್ನು ಪರೀಕ್ಷಿಸಿ",
    decisionRecommendation: "ನಿರ್ಧಾರದ ಶಿಫಾರಸು",
    whyRecommendThis: "ನಾವು ಇದನ್ನು ಏಕೆ ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ",
    alternativeAction: "ಪರ್ಯಾಯ ಕ್ರಮ",
    iUnderstand: "ನಮಗೆ ಅರ್ಥವಾಯಿತು",
    standard: "ಸಾಮಾನ್ಯ",
    simple: "ಸರಳ",
    offlineMessage: "ನೀವು ಸದ್ಯಕ್ಕೆ ಆಫ್‌ಲೈನ್‌ನಲ್ಲಿದ್ದೀರಿ. ಸಂಗ್ರಹಿಸಿದ ಡೇಟಾವನ್ನು ತೋರಿಸಲಾಗುತ್ತಿದೆ.",
    syncingMessage: "ಬಾಕಿ ಇರುವ ಬದಲಾವಣೆಗಳನ್ನು ಸಿಂಕ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    tapToViewDecision: "ಶಿಫಾರಸು ಮಾಡಿದ ನಿರ್ಧಾರವನ್ನು ನೋಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    trackRecord: "ಹಿಂದಿನ ದಾಖಲೆ",
    reliableInsights: "ನಂಬಿಕಸ್ತ ಮಾಹಿತಿ",
    accuracyDesc: "ಕಳೆದ 30 ದಿನಗಳಲ್ಲಿ ನಮ್ಮ ಬೆಲೆ ಮುನ್ಸೂಚನೆಗಳು ನಿಖರವಾಗಿವೆ.",
    priceHistory: "ಬೆಲೆ ಇತಿಹಾಸ",
    predicted: "ಮುನ್ಸೂಚನೆ",
    actual: "ನಿಜವಾದ ಬೆಲೆ",
    waitingMarketData: "ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
    close: "ಮುಚ್ಚಿ",
    setupProfile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸೆಟಪ್ ಮಾಡಿ",
    step: "ಹಂತ",
    of: "ರಲ್ಲಿ",
    chooseCrop: "ನಿಮ್ಮ ಪ್ರಾಥಮಿಕ ಬೆಳೆಯನ್ನ್ನು ಆರಿಸಿ",
    landSize: "ನಿಮ್ಮ ಭೂಮಿಯ ಗಾತ್ರ ಎಷ್ಟು (ಎಕರೆ)?",
    acres: "ಎಕರೆಗಳು",
    irrigationQuestion: "ನೀರಾವರಿ ಸೌಲಭ್ಯವಿದೆಯೇ?",
    storageQuestion: "ಸಂಗ್ರಹಣಾ ಸೌಲಭ್ಯವಿದೆಯೇ?",
    selectMandi: "ನಿಮ್ಮ ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಯನ್ನು ಆರಿಸಿ",
    selectLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
    back: "ಹಿಂದಕ್ಕೆ",
    next: "ಮುಂದೆ",
    finish: "ಮುಕ್ತಾಯ",
    yourProfile: "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್",
    cropMarket: "ಬೆಳೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ",
    primaryCrop: "ಪ್ರಾಥಮಿಕ ಬೆಳೆ",
    nearestMandi: "ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆ",
    preferences: "ಆದ್ಯತೆಗಳು",
    language: "ಭಾಷೆ",
    simpleMode: "ಸರಳ ಮೋಡ್ (SMS ಶೈಲಿ)",
    infrastructure: "ಮೂಲಸೌಕರ್ಯ",
    irrigationAvailable: "ನೀರಾವರಿ ಲಭ್ಯವಿದೆ",
    storageAvailable: "ಸಂಗ್ರಹಣೆ ಲಭ್ಯವಿದೆ",
    saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",
    resetProfile: "ಪ್ರೊಫೈಲ್ ಮರುಹೊಂದಿಸಿ",
    risk: "ಅಪಾಯ",
    accuracy: "ನಿಖರತೆ",
    expectedPriceRange: "ನಿರೀಕ್ಷಿತ ಬೆಲೆ (7-14 ದಿನ)",
    keyPriceDrivers: "ಬೆಲೆಯ ಮೇಲೆ ಪರಿಣಾಮ ಬೀರುವ ಅಂಶಗಳು",
    howAccurate: "ನಾವು ಎಷ್ಟು ನಿಖರವಾಗಿದ್ದೇವೆ? ದಾಖಲೆ ನೋಡಿ",
    smsUpdate: "ಫಾರ್ಮ್‌ಸೈಟ್ ಅಪ್‌ಡೇಟ್",
    smsFallbackLabel: "ಈಗ • SMS ಫಾಲ್‌ಬ್ಯಾಕ್ ಮೋಡ್",
    adviceLabel: "ಸಲಹೆ",
    whyLabel: "ಏಕೆ",
    replyHelp: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ 'HELP' ಎಂದು ರಿಪ್ಲೈ ಮಾಡಿ",
    mandiLabel: "ಮಾರುಕಟ್ಟೆ",
    insufficientData: "ಈ ಬೆಳೆಯ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಪ್ರಸ್ತುತ ಸೀಮಿತವಾಗಿದೆ. ದಯವಿಟ್ಟು ಕೆಲವು ದಿನಗಳ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಬೇರೆ ಮಾರುಕಟ್ಟೆಯನ್ನು ಆರಿಸಿ.",
    livePrice: "ಇಂದಿನ ಬೆಲೆ",
    REC_HOLD_STORAGE_ACTION: "ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳಿ — ಮಾರಾಟ ಮಾಡುವ ಮೊದಲು 5-7 ದಿನ ಕಾಯಿರಿ",
    REC_HOLD_STORAGE_RATIONALE: "ಬೆಲೆಗಳು ಏರುತ್ತಿವೆ, ಮತ್ತು ನಿಮ್ಮ ಸಂಗ್ರಹಣಾ ಸೌಲಭ್ಯವು ಉತ್ತಮ ಬೆಲೆಗಾಗಿ ಕಾಯಲು ಅನುವು ಮಾಡಿಕೊಡುತ್ತದೆ.",
    REC_HOLD_STORAGE_ALT: "ನಿಮಗೆ ತುರ್ತು ಹಣದ ಅಗತ್ಯವಿದ್ದರೆ, ಈಗ ನಿಮ್ಮ ದಾಸ್ತಾನಿನ 30% ಮಾತ್ರ ಮಾರಿ.",
    REC_SELL_NO_STORAGE_ACTION: "ಈಗಿನ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗೆ ಮಾರಿ",
    REC_SELL_NO_STORAGE_RATIONALE: "ಮಾರುಕಟ್ಟೆ ಪೂರೈಕೆ ಹೆಚ್ಚುತ್ತಿದೆ. ಸಂಗ್ರಹಣೆ ಇಲ್ಲದೆ, ಕಾಯುವುದು ಗುಣಮಟ್ಟದ ನಷ್ಟ ಮತ್ತು ಕಡಿಮೆ ಬೆಲೆಯ ಅಪಾಯವನ್ನು ಉಂಟುಮಾಡುತ್ತದೆ.",
    REC_SELL_NO_STORAGE_ALT: "ಮಾರಾಟ ಮಾಡುವ ಮೊದಲು ಹತ್ತಿರದ ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಬೆಲೆ ವ್ಯತ್ಯಾಸವನ್ನು ಪರಿಶೀಲಿಸಿ.",
    REC_SPLIT_VOLATILE_ACTION: "ಈಗ 50% ಮಾರಿ, 50% ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳಿ",
    REC_SPLIT_VOLATILE_RATIONALE: "ಮಾರುಕಟ್ಟೆಯು ಏರಿಕೆಯ ಸಂಭಾವನೆ ತೋರಿಸುತ್ತಿದೆ ಆದರೆ ಅಸ್ಥಿರವಾಗಿದೆ. ದಾಸ್ತಾನನ್ನು ವಿಭಜಿಸುವುದು ನಿಮ್ಮ ಅಪಾಯವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.",
    REC_SPLIT_VOLATILE_ALT: "ಧೋರಣೆ ಸ್ಥಿರವಾಗುತ್ತದೆಯೇ ಎಂದು ನೋಡಲು 2 ದಿನ ಕಾಯಿರಿ.",
    REC_MONITOR_UNCLEAR_ACTION: "ದಿನವೂ ಗಮನಿಸಿ — ಮಾರುಕಟ್ಟೆ ಸ್ಪಷ್ಟವಾಗಿಲ್ಲ",
    REC_MONITOR_UNCLEAR_RATIONALE: "ಪ್ರಸ್ತುತ ಸೂಚಕಗಳು ಮಿಶ್ರವಾಗಿವೆ. ಸ್ಪಷ್ಟ ಧೋರಣೆ ಬರುವವರೆಗೆ ದೊಡ್ಡ ಪ್ರಮಾಣದ ಮಾರಾಟವನ್ನು ತಪ್ಪಿಸಿ.",
    REC_MONITOR_UNCLEAR_ALT: "ನೀವು ಮಾರಾಟ ಮಾಡುವಾಗ ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಲು ಬೆಳೆಯ ಗುಣಮಟ್ಟದ ಮೇಲೆ ಗಮನ ಹರಿಸಿ.",
  },
  Marathi: {
    forecastFor: "अंदाज",
    in: "मधील",
    expectedPriceIs: "अपेक्षित किंमत",
    to: "आणि",
    rupeesPerKg: "रुपये प्रति किलो दरम्यान आहे",
    trendIs: "कल",
    up: "वाढत आहे",
    down: "कमी होत आहे",
    stable: "स्थिर आहे",
    confidenceIs: "आत्मविश्वास",
    percent: "टक्के आहे",
    keyFactors: "मुख्य घटक",
    hold: "थांबा",
    sell: "विकून टाका",
    moderate: "मध्यम",
    high: "उच्च",
    low: "कमी",
    safe: "सुरक्षित",
    risky: "धोकादायक",
    hello: "नमस्कार",
    communitySignal: "सामुदायिक संकेत",
    farmersInYourDistrict: "तुमच्या जिल्ह्यातील शेतकरी",
    thisSeason: "या हंगामात पिकवण्याचे नियोजन करत आहेत",
    listen: "ऐका",
    checkAccuracy: "अचूकता तपासा",
    decisionRecommendation: "निर्णय शिफारस",
    whyRecommendThis: "आम्ही याची शिफारस का करतो",
    alternativeAction: "पर्यायी कृती",
    iUnderstand: "मला समजले",
    standard: "मानक",
    simple: "साधे",
    offlineMessage: "तुम्ही सध्या ऑफलाइन आहात. कॅश केलेला डेटा दाखवत आहे.",
    syncingMessage: "प्रलंबित बदल सिंक करत आहे...",
    tapToViewDecision: "शिफारस केलेला निर्णय पाहण्यासाठी टॅप करा",
    trackRecord: "ट्रॅक रेकॉर्ड",
    reliableInsights: "विश्वसनीय माहिती",
    accuracyDesc: "आमचे किंमत अंदाज मागील ३० दिवसात अचूक होते.",
    priceHistory: "किंमत इतिहास",
    predicted: "अंदाजित",
    actual: "वास्तविक",
    waitingMarketData: "बाजार माहितीची वाट पाहत आहे...",
    close: "बंद करा",
    setupProfile: "तुमची प्रोफाइल सेट करा",
    step: "टप्पा",
    of: "पैकी",
    chooseCrop: "तुमचे मुख्य पीक निवडा",
    landSize: "तुमची जमीन किती आहे (एकर)?",
    acres: "एकर",
    irrigationQuestion: "तुमच्याकडे सिंचनाची सोय आहे का?",
    storageQuestion: "तुमच्याकडे साठवणुकीची सोय आहे का?",
    selectMandi: "तुमची जवळची मंडी निवडा",
    selectLanguage: "तुमची भाषा निवडा",
    back: "मागे",
    next: "पुढे",
    finish: "पूर्ण करा",
    yourProfile: "तुमची प्रोफाइल",
    cropMarket: "पीक आणि बाजार",
    primaryCrop: "मुख्य पीक",
    nearestMandi: "जवळची मंडी",
    preferences: "प्राधान्ये",
    language: "भाषा",
    simpleMode: "साधा मोड (SMS-शैली)",
    infrastructure: "पायाभूत सुविधा",
    irrigationAvailable: "सिंचन उपलब्ध",
    storageAvailable: "साठवणूक उपलब्ध",
    saveChanges: "बदल जतन करा",
    resetProfile: "प्रोफाइल रिसेट करा",
    risk: "धोका",
    accuracy: "अचूकता",
    expectedPriceRange: "अपेक्षित किंमत (7-14 दिवस)",
    keyPriceDrivers: "किंमतीवर परिणाम करणारे घटक",
    howAccurate: "आम्ही किती अचूक आहोत? ट्रॅक रेकॉर्ड पहा",
    smsUpdate: "फार्मसाइट अपडेट",
    smsFallbackLabel: "आता • SMS फॉलबॅक मोड",
    adviceLabel: "सल्ला",
    whyLabel: "का",
    replyHelp: "अधिक माहितीसाठी 'HELP' रिप्लाय करा",
    mandiLabel: "मंडी",
    insufficientData: "या पिकासाठी बाजारपेठेतील माहिती सध्या मर्यादित आहे. कृपया काही दिवसांनी पुन्हा तपासा किंवा दुसरी बाजारपेठ निवडा।",
    livePrice: "आजचा भाव",
    REC_HOLD_STORAGE_ACTION: "थांबा — विक्रीपूर्वी ५-७ दिवस वाट पहा",
    REC_HOLD_STORAGE_RATIONALE: "किंमती वाढत आहेत आणि तुमच्याकडे साठवणुकीची सोय असल्याने तुम्ही चांगल्या किंमतीसाठी थांबू शकता.",
    REC_HOLD_STORAGE_ALT: "जर तुम्हाला पैशांची तात्काळ गरज असेल, तर फक्त ३०% माल आता विकून टाका.",
    REC_SELL_NO_STORAGE_ACTION: "सध्याच्या बाजारभावाने आताच विक्री करा",
    REC_SELL_NO_STORAGE_RATIONALE: "बाजारात आवक वाढत आहे. साठवणुकीशिवाय माल थांबवून ठेवल्यास दर्जा खराब होण्याचा आणि किंमत कमी मिळण्याचा धोका आहे.",
    REC_SELL_NO_STORAGE_ALT: "विक्री करण्यापूर्वी जवळच्या मंड्यांमधील दरातील फरक तपासा.",
    REC_SPLIT_VOLATILE_ACTION: "आत्ता ५०% विक्री करा, ५०% थांबवून ठेवा",
    REC_SPLIT_VOLATILE_RATIONALE: "बाजारात दरवाढीची शक्यता आहे पण बाजार अस्थिर आहे. मालाची विभागणी केल्यास तुमचा धोका कमी होईल.",
    REC_SPLIT_VOLATILE_ALT: "बाजार स्थिर होतोय का हे पाहण्यासाठी २ दिवस वाट पहा.",
    REC_MONITOR_UNCLEAR_ACTION: "दररोज लक्ष ठेवा — बाजार स्पष्ट नाही",
    REC_MONITOR_UNCLEAR_RATIONALE: "सध्याचे संकेत संमिश्र आहेत. स्पष्ट कल येईपर्यंत मोठी विक्री टाळा.",
    REC_MONITOR_UNCLEAR_ALT: "विक्री करताना उत्तम भाव मिळवण्यासाठी पिकाच्या गुणवत्तेवर लक्ष केंद्रित करा.",
  },
  Telugu: {
    forecastFor: "అంచనా",
    in: "లో",
    expectedPriceIs: "అంచనా ధర",
    to: "మరియు",
    rupeesPerKg: "రూపాయల మధ్య ఉంటుంది",
    trendIs: "ధోరణి",
    up: "పెరుగుతోంది",
    down: "తగ్గుతోంది",
    stable: "స్థిరంగా ఉంది",
    confidenceIs: "నమ్మక స్థాయి",
    percent: "శాతం ఉంది",
    keyFactors: "ముఖ్య అంశాలు",
    hold: "ఆపండి",
    sell: "అమ్మండి",
    moderate: "మితంగా",
    high: "ఎక్కువ",
    low: "తక్కువ",
    safe: "సురక్షితం",
    risky: "ప్రమాదకరం",
    hello: "నమస్కారం",
    communitySignal: "కమ్యూనిటీ సిగ్నల్",
    farmersInYourDistrict: "మీ జిల్లాలోని రైతులు",
    thisSeason: "ఈ సీజన్లో పండించాలని ప్లాన్ చేస్తున్నారు",
    listen: "వినండి",
    checkAccuracy: "ఖచ్చితత్వాన్ని తనిఖీ చేయండి",
    decisionRecommendation: "నిర్ణయ సిఫార్సు",
    whyRecommendThis: "మేము దీనిని ఎందుకు సిఫార్సు చేస్తున్నాము",
    alternativeAction: "ప్రత్యామ్నాయ చర్య",
    iUnderstand: "నాకు అర్థమైంది",
    standard: "సాధారణ",
    simple: "సరళమైన",
    offlineMessage: "మీరు ప్రస్తుతం ఆఫ్లైన్లో ఉన్నారు. కాష్ చేసిన డేటాను చూపుతోంది.",
    syncingMessage: "పెండింగ్లో ఉన్న మార్పులను సమకాలీకరిస్తోంది...",
    tapToViewDecision: "సిఫార్సు చేసిన నిర్ణయాన్ని చూడటానికి నొక్కండి",
    trackRecord: "ట్రాక్ రికార్డు",
    reliableInsights: "నమ్మకమైన సమాచారం",
    accuracyDesc: "గత 30 రోజుల్లో మా ధరల అంచనాలు ఖచ్చితంగా ఉన్నాయి.",
    priceHistory: "ధరల చరిత్ర",
    predicted: "అంచనా",
    actual: "నిజమైన ధర",
    waitingMarketData: "మార్కెట్ సమాచారం కోసం నిరీక్షణ...",
    close: "మూసివేయి",
    setupProfile: "మీ ప్రొఫైల్ సెటప్ చేయండి",
    step: "దశ",
    of: "లో",
    chooseCrop: "మీ ప్రాథಮిక పంటను ఎంచుకోండి",
    landSize: "మీ భూమి పరిమాణం ఎంత (ఎకరాలు)?",
    acres: "ఎకరాలు",
    irrigationQuestion: "మీకు నీటి పారుదల సౌకర్యం ఉందా?",
    storageQuestion: "మీకు నిల్వ సౌకర్యం ఉందా?",
    selectMandi: "మీకు దగ్గరలోని మార్కెట్ ఎంచుకోండి",
    selectLanguage: "మీ భాషను ఎంచుకోండి",
    back: "వెనకకు",
    next: "తరువాత",
    finish: "పూర్తయింది",
    yourProfile: "మీ ప్రొఫైల్",
    cropMarket: "పంట మరియు మార్కెట్",
    primaryCrop: "ప్రాథమిక పంట",
    nearestMandi: "దగ్గరలోని మార్కెట్",
    preferences: "ప్రాధాన్యతలు",
    language: "భాష",
    simpleMode: "సరళమైన మోడ్ (SMS-శైలి)",
    infrastructure: "మౌలిక సదుపాయాలు",
    irrigationAvailable: "నీటి పారుదల అందుబాటులో ఉంది",
    storageAvailable: "నిల్వ సౌకర్యం అందుబాటులో ఉంది",
    saveChanges: "మార్పులను సేవ్ చేయి",
    resetProfile: "ప్రొఫైల్ రీసెట్ చేయి",
    risk: "ప్రమాదం",
    accuracy: "ఖచ్చితత్వం",
    expectedPriceRange: "అంచనా ధర (7-14 రోజులు)",
    keyPriceDrivers: "ధరను ప్రభావితం చేసే అంశాలు",
    howAccurate: "మా సమాచారం ఎంత ఖచ్చితంగా ఉంది? ట్రాక్ రికార్డు చూడండి",
    smsUpdate: "ఫామ్సైట్ అప్డేట్",
    smsFallbackLabel: "ఇప్పుడు • SMS ఫాల్బ్యాక్ మోడ్",
    adviceLabel: "సలహా",
    whyLabel: "ఎందుకు",
    replyHelp: "మరింత సమాచారం కోసం 'HELP' అని రిప్లై ఇవ్వండి",
    mandiLabel: "మార్కెట్",
    insufficientData: "ఈ పంటకు సంబంధించిన మార్కెట్ సమాచారం ప్రస్తుతం తక్కువగా ఉంది. దయచేసి కొన్ని రోజుల తర్వాత మళ్లీ ప్రయత్నించండి లేదా వేరే మార్కెట్‌ను ఎంచుకోండి.",
    livePrice: "నేటి ధర",
    REC_HOLD_STORAGE_ACTION: "ఆపండి — అమ్మే ముందు 5-7 రోజులు వేచి ఉండండి",
    REC_HOLD_STORAGE_RATIONALE: "ధరలు పెరుగుతున్నాయి మరియు మీ నిల్వ సౌకర్యం మంచి ధర కోసం వేచి ఉండటానికి అనుమతిస్తుంది.",
    REC_HOLD_STORAGE_ALT: "మీకు అత్యవసరంగా డబ్బు అవసరమైతే, ఇప్పుడు మీ స్టాక్లో 30% మాత్రమే అమ్మండి.",
    REC_SELL_NO_STORAGE_ACTION: "ప్రస్తుత మార్కెట్ ధరకే అమ్మండి",
    REC_SELL_NO_STORAGE_RATIONALE: "మార్కెట్ సరఫరా పెరుగుతోంది. నిల్వ లేకుండా ఆపడం వల్ల నాణ్యత దెబ్బతినే మరియు తక్కువ ధర వచ్చే ప్రమాదం ఉంది.",
    REC_SELL_NO_STORAGE_ALT: "అమ్మే ముందు దగ్గరలోని మార్కెట్లలో ధరల వ్యత్యాసాన్ని తనిఖీ చేయండి.",
    REC_SPLIT_VOLATILE_ACTION: "ఇప్పుడు 50% అమ్మండి, 50% ఆపండి",
    REC_SPLIT_VOLATILE_RATIONALE: "మార్కెట్ పెరిగే అవకాశం ఉంది కానీ అస్థిరంగా ఉంది. స్టాక్ను విభజించడం వల్ల మీ ప్రమాదం తగ్గుతుంది.",
    REC_SPLIT_VOLATILE_ALT: "ధోరణి స్థిరపడుతుందో లేదో చూడటానికి 2 రోజులు వేచి ఉండండి.",
    REC_MONITOR_UNCLEAR_ACTION: "ప్రతిరోజూ గమనించండి — మార్కెట్ స్పష్టంగా లేదు",
    REC_MONITOR_UNCLEAR_RATIONALE: "ప్రస్తుత సూచికలు మిశ్రమంగా ఉన్నాయి. స్పష్టమైన ధోరణి వచ్చే వరకు పెద్ద అమ్మకాలను నివారించండి.",
    REC_MONITOR_UNCLEAR_ALT: "మీరు అమ్మేటప్పుడు మంచి ధర పొందడానికి పంట నాణ್ಯతపై దృష్టి పెట్టండి.",
  }
};

export const getLocalizedReadout = (forecast: any, lang: string) => {
  const t = translations[lang] || translations.English;
  
  if (forecast.status === 'insufficient_data') {
    if (forecast.todayPrice) {
      return `${t.forecastFor} ${forecast.crop} ${t.in} ${forecast.mandi}. ${t.livePrice} ${t.rupeesPerKg}: ₹${forecast.todayPrice}. ${t.insufficientData}`;
    }
    return t.insufficientData;
  }

  const trendMap: any = {
    up: t.up,
    down: t.down,
    stable: t.stable
  };

  const text = `${t.forecastFor} ${forecast.crop} ${t.in} ${forecast.mandi}. 
    ${t.expectedPriceIs} ${forecast.price_low} ${t.to} ${forecast.price_high} ${t.rupeesPerKg}. 
    ${t.trendIs} ${trendMap[forecast.trend] || forecast.trend}. 
    ${t.confidenceIs} ${forecast.confidence} ${t.percent}. 
    ${t.keyFactors}: ${forecast.drivers.join('. ')}`;

  return text;
};

import { useProfileStore } from '../store/useProfileStore';

export const useTranslation = () => {
  const language = useProfileStore((state) => state.profile.language);
  const t = translations[language] || translations.English;
  return { t, language };
};
