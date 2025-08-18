import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';
import Card from '../components/Card';

export default function LearnScreen() {
  const sample = { title: 'hola', subtitle: 'hello (ES → EN)' };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Learning Cards</Text>
      <Text style={styles.subtitle}>Swipe right if you know it, left if you don't.</Text>
      <View style={styles.content}>
        <Card title={sample.title} subtitle={sample.subtitle} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  subtitle: { marginTop: spacing.md, color: colors.muted },
  content: { flex: 1, justifyContent: 'center' },
});
