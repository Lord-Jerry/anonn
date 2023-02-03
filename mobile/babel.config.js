module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
    [
      'module-resolver',
      {
        root: ['./src/'],
        alias: [
          {'@src': './src'},
          {'@components': './src/components'},
          {'@screens': './src/screens'},
          {'@navigation': './src/navigation'},
          {'@constant': './src/constant'},
          {'@hooks': './src/hooks'},
          {'@services': './src/services'},
          {'@utils': './src/utils'},
          {'@config': './src/config'},
          {'@assets': './assets'},
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
  // plugins: ["nativewind/babel"],
};
