import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckIcon, CloseIcon } from '../assets/icons';
import { fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  visible: boolean;
  term: string;
  options: string[];
  correctIndex: number;
  onRequestClose: () => void;
  onResolved: (correct: boolean) => void;
};

export default function TranslationQuizModal({
  visible,
  term,
  options,
  correctIndex,
  onRequestClose,
  onResolved,
}: Props) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [answered, setAnswered] = React.useState(false);
  const banner = useSharedValue(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!visible) {
      setSelectedIndex(null);
      setAnswered(false);
      banner.value = 0;
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [banner, visible]);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const correct = selectedIndex != null && selectedIndex === correctIndex;

  const bannerStyle = useAnimatedStyle(() => ({
    opacity: banner.value,
    height: 52 * banner.value,
    marginBottom: spacing.md * banner.value,
    transform: [{ scale: 0.92 + 0.08 * banner.value }],
  }));

  const onPick = (idx: number) => {
    if (answered) return;
    setSelectedIndex(idx);
    setAnswered(true);
    banner.value = withSpring(1, { damping: 14, stiffness: 180 });
    const isCorrect = idx === correctIndex;
    timerRef.current = setTimeout(() => onResolved(isCorrect), 950);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (!answered) onRequestClose();
      }}
    >
      <SafeAreaView style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => {
            if (!answered) onRequestClose();
          }}
        />

        <View style={styles.card}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.banner,
              { backgroundColor: correct ? 'rgba(32,178,107,0.18)' : 'rgba(229,72,77,0.18)' },
              bannerStyle,
            ]}
          >
            <View style={[styles.bannerIcon, { backgroundColor: correct ? colors.success : colors.danger }]}>
              {correct ? <CheckIcon size={18} color="white" /> : <CloseIcon size={18} color="white" />}
            </View>
            <Text style={styles.bannerText}>{correct ? 'Correct' : 'Not quite'}</Text>
          </Animated.View>

          <Text style={styles.kicker}>Choose the translation</Text>
          <Text style={styles.term} numberOfLines={2}>
            {term}
          </Text>

          <View style={styles.options}>
            {options.slice(0, 4).map((opt, idx) => {
              const isSelected = selectedIndex === idx;
              const isCorrectOption = idx === correctIndex;
              const showAsCorrect = answered && isCorrectOption;
              const showAsWrong = answered && isSelected && !isCorrectOption;

              return (
                <Pressable
                  key={`${idx}-${opt}`}
                  onPress={() => onPick(idx)}
                  disabled={answered}
                  style={({ pressed }) => [
                    styles.option,
                    pressed && !answered ? { opacity: 0.85 } : null,
                    showAsCorrect ? styles.optionCorrect : null,
                    showAsWrong ? styles.optionWrong : null,
                    answered && !showAsCorrect && !showAsWrong ? styles.optionDim : null,
                  ]}
                >
                  <Text style={styles.optionText} numberOfLines={2}>
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.hint}>
            {answered ? (correct ? 'Nice.' : `Correct: ${options[correctIndex] ?? ''}`) : 'Tip: trust your first instinct.'}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const makeStyles = (colors: {
  success: string;
  danger: string;
  text: string;
  muted: string;
  border: string;
  background: string;
}) =>
  StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,15,26,0.72)',
    padding: spacing.xl,
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    borderRadius: radii.xl,
    backgroundColor: 'rgba(20,24,40,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    padding: spacing.xl,
    ...shadows.medium,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    overflow: 'hidden',
  },
  bannerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 14,
    fontWeight: '900',
    color: 'white',
    fontFamily: fontFamilies.heading,
    letterSpacing: 0.2,
  },
  kicker: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.70)',
    fontFamily: fontFamilies.body,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  term: {
    marginTop: spacing.sm,
    fontSize: 34,
    fontWeight: '900',
    color: 'white',
    fontFamily: fontFamilies.display,
  },
  options: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  option: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
    fontFamily: fontFamilies.heading,
    lineHeight: 22,
  },
  optionCorrect: {
    backgroundColor: 'rgba(32,178,107,0.18)',
    borderColor: 'rgba(32,178,107,0.55)',
  },
  optionWrong: {
    backgroundColor: 'rgba(229,72,77,0.18)',
    borderColor: 'rgba(229,72,77,0.55)',
  },
  optionDim: {
    opacity: 0.55,
  },
  hint: {
    marginTop: spacing.lg,
    fontSize: 13,
    color: 'rgba(255,255,255,0.70)',
    fontFamily: fontFamilies.body,
    textAlign: 'center',
    lineHeight: 18,
  },
});
