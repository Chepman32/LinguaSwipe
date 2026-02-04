import React from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native';
import { colors, fontFamilies, radii, spacing, shadows } from '../theme/tokens';

export interface CardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  children?: React.ReactNode;
}

export default function Card({
  title,
  subtitle,
  icon,
  onPress,
  variant = 'default',
  style,
  titleStyle,
  subtitleStyle,
  children,
}: CardProps) {
  const variantStyles = {
    default: { borderColor: colors.border, backgroundColor: colors.card },
    primary: { borderColor: colors.primary, backgroundColor: '#F0F4FF' },
    success: { borderColor: colors.success, backgroundColor: '#E6F7F0' },
    warning: { borderColor: colors.accent, backgroundColor: '#FFF4E3' },
  };

  const content = (
    <View style={[styles.card, variantStyles[variant], style]}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle && <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>}
      </View>
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    borderRadius: radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.soft,
  },
  iconWrap: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    fontFamily: fontFamilies.heading,
  },
  subtitle: {
    marginTop: spacing.xs,
    fontSize: 13,
    color: colors.muted,
    fontFamily: fontFamilies.body,
  },
});
