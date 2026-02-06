import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  label: string;
  value: string | number;
  accent?: string;
  icon?: React.ReactNode;
};

export default function StatTile({ label, value, accent, icon }: Props) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const resolvedAccent = accent ?? colors.primary;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        {icon ? <View style={[styles.iconWrap, { backgroundColor: `${resolvedAccent}1A` }]}>{icon}</View> : null}
        <Text style={styles.value}>{value}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const makeStyles = (colors: { card: string; text: string; muted: string }) =>
  StyleSheet.create({
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
