export interface TranslationMap {
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
    marketOverview: string;
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
    marketOverview: "Market Overview",
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
  }
};
