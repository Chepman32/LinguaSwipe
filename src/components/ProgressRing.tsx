import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View } from 'react-native';

type Props = { size?: number; stroke?: number; progress: number; color?: string; bg?: string };

export default function ProgressRing({ size = 96, stroke = 8, progress, color = '#007AFF', bg = '#E5E5EA' }: Props) {
  const clamped = Math.max(0, Math.min(100, progress));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped * c) / 100;
  return (
    <View>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} stroke={bg} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          stroke={color}
          fill="none"
          strokeDasharray={`${c}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}
