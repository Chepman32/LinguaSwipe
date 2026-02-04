import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamilies, radii, shadows, spacing } from '../theme/tokens';

type Props = {
  label: string;
  value: string | number;
  accent?: string;
  icon?: React.ReactNode;
};

export default function StatTile({ label, value, accent = colors.primary, icon }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {icon ? <View style={[styles.iconWrap, { backgroundColor: `${accent}1A` }]}>{icon}</View> : null}
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: spacing.lg,
    backgroundColor: colors.card,
    borderRadius: radii.lg,
    ...shadows.soft,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fontFamilies.heading,
  },
  label: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.muted,
    fontFamily: fontFamilies.body,
  },
});
