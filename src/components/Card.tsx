import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../theme/tokens';

export default function Card({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: 'white', padding: spacing.xl, borderRadius: radii.lg, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: spacing.sm, color: colors.muted },
});
