const {getDefaultConfig} = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.assetExts.push('db');

module.exports = defaultConfig;

/*
module.exports = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'db'],
  },
};
*/
