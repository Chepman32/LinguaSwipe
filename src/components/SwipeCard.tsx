import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { getImageCandidates } from '../utils/imageSources';
import { useAppTheme } from '../theme/ThemeProvider';

type Props = {
  term: string;
  translation: string;
  imageUrl: string;
  onSwipe: (direction: 'known' | 'again') => void;
};

const SWIPE_THRESHOLD = 120;

export default function SwipeCard({ term, translation, imageUrl, onSwipe }: Props) {
  const { colors } = useAppTheme();
  const styles = React.useMemo(() => makeStyles(colors), [colors]);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const [showTranslation, setShowTranslation] = React.useState(false);
  const imageCandidates = React.useMemo(() => getImageCandidates(imageUrl), [imageUrl]);
  const [imageIndex, setImageIndex] = React.useState(0);

  const currentImage = imageCandidates[imageIndex] ?? imageUrl;

  React.useEffect(() => {
    translateX.value = withSpring(0);
    rotate.value = withSpring(0);
    setShowTranslation(false);
    setImageIndex(0);
  }, [term, translation, imageUrl, rotate, translateX]);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(500);
        runOnJS(onSwipe)('known');
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-500);
        runOnJS(onSwipe)('again');
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
  }));

  const hintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(Math.abs(translateX.value), [0, SWIPE_THRESHOLD], [0, 1]),
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.hint, styles.hintLeft, hintStyle]}>
        <Text style={styles.hintText}>Again</Text>
      </Animated.View>
      <Animated.View style={[styles.hint, styles.hintRight, hintStyle]}>
        <Text style={styles.hintText}>Know</Text>
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Pressable onPress={() => setShowTranslation((prev) => !prev)} style={styles.pressable}>
            <FastImage
              source={{
                uri: currentImage,
                priority: FastImage.priority.normal,
                cache: FastImage.cacheControl.immutable,
              }}
              style={styles.image}
              resizeMode={FastImage.resizeMode.cover}
              onError={() => {
                setImageIndex((prev) => (prev + 1 < imageCandidates.length ? prev + 1 : prev));
              }}
            />
            <View style={styles.content}>
              <Text style={styles.word}>{showTranslation ? translation : term}</Text>
              <Text style={styles.helper}>{showTranslation ? 'Tap to see term' : 'Tap to see translation'}</Text>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const makeStyles = (colors: {
  card: string;
  border: string;
  background: string;
  text: string;
  muted: string;
}) =>
  StyleSheet.create({
  wrapper: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: 420,
  },
  card: {
    width: '92%',
    backgroundColor: colors.card,
    borderRadius: radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.medium,
  },
  pressable: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background,
  },
  content: {
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
  },
  word: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    fontFamily: fontFamilies.display,
  },
  helper: {
    marginTop: spacing.md,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    fontFamily: fontFamilies.body,
  },
  hint: {
    position: 'absolute',
    top: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    ...shadows.soft,
    zIndex: 10,
  },
  hintLeft: { left: 40 },
  hintRight: { right: 40 },
  hintText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
});
