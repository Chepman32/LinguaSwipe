import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type Props = { width?: number; height?: number };

export default function HeroScene({ width = 320, height = 220 }: Props) {
  return (
    <Svg width={width} height={height} viewBox="0 0 320 220" fill="none">
      <Rect x={16} y={18} width={288} height={184} rx={30} fill="#FFFFFF" />
      <Circle cx={86} cy={78} r={32} fill="#2B6EF6" opacity={0.18} />
      <Circle cx={236} cy={130} r={44} fill="#FFB547" opacity={0.18} />
      <Rect x={58} y={56} width={140} height={16} rx={8} fill="#2B6EF6" />
      <Rect x={58} y={82} width={188} height={12} rx={6} fill="#D1D6E5" />
      <Rect x={58} y={108} width={128} height={12} rx={6} fill="#D1D6E5" />
      <Path d="M210 64l22 22-22 22" stroke="#2B6EF6" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      <Rect x={58} y={138} width={180} height={34} rx={17} fill="#2B6EF6" opacity={0.12} />
    </Svg>
  );
}
