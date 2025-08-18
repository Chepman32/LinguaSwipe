import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { colors, spacing } from '../theme/tokens';

export default function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Home'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back 👋</Text>
      <View style={styles.actions}>
        <Pressable style={styles.btn} onPress={() => navigation.navigate('Learn')}>
          <Text style={styles.btnText}>Start Learning</Text>
        </Pressable>
        <Pressable style={[styles.btn, styles.secondary]} onPress={() => navigation.navigate('Review')}>
          <Text style={styles.btnText}>Review</Text>
        </Pressable>
      </View>
      <Pressable onPress={() => navigation.navigate('Settings')}><Text style={styles.link}>Settings</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text, marginTop: spacing.lg },
  actions: { marginTop: spacing.xl, gap: spacing.md },
  btn: { backgroundColor: colors.primary, padding: spacing.lg, borderRadius: 12, alignItems: 'center' },
  secondary: { backgroundColor: '#8E8E93' },
  btnText: { color: 'white', fontWeight: '700' },
  link: { marginTop: spacing.lg, color: colors.primary, fontWeight: '600' },
});
