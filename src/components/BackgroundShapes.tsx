import React from 'react';
import { StyleSheet, View } from 'react-native';

type Props = { variant?: 'cool' | 'warm' };

export default function BackgroundShapes({ variant = 'cool' }: Props) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[styles.blob, styles.top, { backgroundColor: variant === 'warm' ? '#FFF4E3' : '#E8EEFF' }]} />
      <View style={[styles.blob, styles.bottom, { backgroundColor: variant === 'warm' ? '#FFE8EC' : '#E6F7F0' }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    opacity: 0.6,
  },
  top: { top: -60, right: -80 },
  bottom: { bottom: -80, left: -60 },
});
