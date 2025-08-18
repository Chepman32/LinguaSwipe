import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { colors, spacing } from '../theme/tokens';

export default function SettingsScreen() {
  const [val, setVal] = React.useState(true);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Sounds</Text>
        <Switch value={val} onValueChange={setVal} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  row: { marginTop: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: colors.text },
});
