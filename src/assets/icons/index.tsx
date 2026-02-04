import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

type IconProps = { size?: number; color?: string };

export function HomeIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 11.5L12 5l8 6.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6.5 10.5V19a1 1 0 0 0 1 1H16.5a1 1 0 0 0 1-1v-8.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M10 19v-5h4v5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CardsIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={6} width={13} height={15} rx={3} stroke={color} strokeWidth={2} />
      <Rect x={9} y={3} width={10} height={13} rx={3} stroke={color} strokeWidth={2} opacity={0.6} />
      <Path d="M8 13h7" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function ChartIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 19h16" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Rect x={6} y={11} width={3} height={7} rx={1} fill={color} />
      <Rect x={11} y={7} width={3} height={11} rx={1} fill={color} opacity={0.8} />
      <Rect x={16} y={4} width={3} height={14} rx={1} fill={color} opacity={0.6} />
    </Svg>
  );
}

export function ProfileIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={8} r={4} stroke={color} strokeWidth={2} />
      <Path d="M4 20c1.6-3.3 4.5-5 8-5s6.4 1.7 8 5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CrownIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 8l4 4 4-6 4 6 4-4-2 10H6L4 8z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M7 19h10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function FlameIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3c2.2 2.5 2.8 4.4 1.3 6.8-1.2 1.8-3.3 2.7-3.3 5.2 0 2.4 1.9 4 4 4 2.8 0 5-2.2 5-5.2 0-4-2.3-7.1-7-10.8z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function BoltIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function SettingsIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
      <Path
        d="M19.4 15a7.7 7.7 0 0 0 .1-2l2-1.5-2-3.4-2.3.7a7.8 7.8 0 0 0-1.7-1l-.3-2.4h-4l-.3 2.4a7.8 7.8 0 0 0-1.7 1L6.5 7.1 4.5 10.5 6.5 12a7.7 7.7 0 0 0 0 2l-2 1.5 2 3.4 2.3-.7a7.8 7.8 0 0 0 1.7 1l.3 2.4h4l.3-2.4a7.8 7.8 0 0 0 1.7-1l2.3.7 2-3.4-2-1.5z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function SoundIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 9v6h4l5 4V5L8 9H4z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <Path d="M16 9c1.5 1.5 1.5 4.5 0 6" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M19 7c2.5 2.5 2.5 7.5 0 10" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function LanguageIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 6h10M9 6v4" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M5 18c3-1.5 5-4.5 6-8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M12 18l4-8 4 8" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M14 14h6" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function CheckIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 13l4 4L19 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CloseIcon({ size = 24, color = '#1F2A44' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}
