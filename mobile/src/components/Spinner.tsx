import React from 'react';
import Svg, {Defs, LinearGradient, Stop, Circle} from 'react-native-svg';

export default function Loader() {
  return (
    <Svg viewBox="0 0 100 100" width="60" height="40">
      <Defs>
        <LinearGradient id="Gradient" x1="50%" y1="0%" x2="50%" y2="100%">
          <Stop offset="0%" stopColor="#D3FF56" />
          <Stop offset="100%" stopColor="#00AFAA" />
        </LinearGradient>
      </Defs>
      <Circle cx="50" cy="50" r="30" fill="none" />
    </Svg>
  );
}
