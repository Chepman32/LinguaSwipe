import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/tokens';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.subtitle}>Badges and avatar coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: spacing.md, color: colors.muted },
});
