import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

type Props = { variant?: 'swipe' | 'repeat' | 'offline' | 'language'; width?: number; height?: number };

export default function OnboardingScene({ variant = 'swipe', width = 260, height = 200 }: Props) {
  const accent = variant === 'repeat' ? '#FFB547' : variant === 'offline' ? '#20B26B' : variant === 'language' ? '#E5484D' : '#2B6EF6';
  return (
    <Svg width={width} height={height} viewBox="0 0 260 200" fill="none">
      <Rect x={18} y={20} width={224} height={160} rx={28} fill="#FFFFFF" />
      <Circle cx={70} cy={72} r={30} fill={accent} opacity={0.16} />
      <Circle cx={190} cy={130} r={36} fill={accent} opacity={0.12} />
      <Path d="M64 70h72" stroke={accent} strokeWidth={6} strokeLinecap="round" />
      <Path d="M64 94h104" stroke="#D1D6E5" strokeWidth={6} strokeLinecap="round" />
      <Rect x={52} y={118} width={156} height={34} rx={16} fill={accent} opacity={0.18} />
      {variant === 'swipe' && <Path d="M170 62l18 18-18 18" stroke={accent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />}
      {variant === 'repeat' && <Path d="M182 70c8 0 14 6 14 14" stroke={accent} strokeWidth={6} strokeLinecap="round" />}
      {variant === 'offline' && <Path d="M170 62l24 24" stroke={accent} strokeWidth={6} strokeLinecap="round" />}
      {variant === 'language' && (
        <>
          <Circle cx={176} cy={70} r={16} stroke={accent} strokeWidth={5} />
          <Path d="M166 110h28" stroke={accent} strokeWidth={6} strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}
