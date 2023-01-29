module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
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
          {'@assets': './assets'}
        ],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
  ],
  // plugins: ["nativewind/babel"],
};
