const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add 'wasm' to the asset extensions
config.resolver.assetExts.push("wasm");

// Ensure 'wasm' is NOT in sourceExts (it's a binary, not source code)
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== "wasm",
);

module.exports = config;
