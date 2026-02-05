import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';

import { CheckIcon, ImageIcon, InfoIcon } from '../assets/icons';
import { colors, fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { getImageCandidates, getImageTags } from '../utils/imageSources';

export type TinderStudyCardHandle = {
  swipe: (direction: 'known' | 'again') => void;
};

type Props = {
  term: string;
  translation: string;
  imageUrl: string;
  onSwipe: (direction: 'known' | 'again') => void;
};

const SWIPE_THRESHOLD = 120;
const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_HEIGHT = Math.min(620, Math.max(480, Math.round(SCREEN_HEIGHT * 0.72)));

export default React.forwardRef<TinderStudyCardHandle, Props>(function TinderStudyCard(
  { term, translation, imageUrl, onSwipe },
  ref,
) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const [cardWidth, setCardWidth] = React.useState(0);

  const candidates = React.useMemo(() => getImageCandidates(imageUrl), [imageUrl]);
  const tags = React.useMemo(() => getImageTags(imageUrl).slice(0, 5), [imageUrl]);

  const [imageIndex, setImageIndex] = React.useState(0);
  const [imageFailed, setImageFailed] = React.useState(false);
  const [showTranslation, setShowTranslation] = React.useState(false);

  React.useEffect(() => {
    translateX.value = withSpring(0);
    rotate.value = withSpring(0);
    setImageIndex(0);
    setImageFailed(false);
    setShowTranslation(false);
  }, [term, translation, imageUrl, rotate, translateX]);

  React.useEffect(() => {
    // Preload alternative images so taps feel instant (Tinder-style).
    if (candidates.length > 1) {
      FastImage.preload(candidates.map((uri) => ({ uri })));
    }
  }, [candidates]);

  const finishSwipe = React.useCallback(
    (direction: 'known' | 'again') => {
      onSwipe(direction);
    },
    [onSwipe],
  );

  const animateSwipe = React.useCallback(
    (direction: 'known' | 'again') => {
      const toX = direction === 'known' ? 520 : -520;
      translateX.value = withSpring(toX, { damping: 14, stiffness: 180 }, (finished) => {
        if (finished) runOnJS(finishSwipe)(direction);
      });
    },
    [finishSwipe, translateX],
  );

  React.useImperativeHandle(ref, () => ({
    swipe: (direction) => {
      animateSwipe(direction);
    },
  }));

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 22;
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        animateSwipe('known');
      } else if (translateX.value < -SWIPE_THRESHOLD) {
        animateSwipe('again');
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { rotate: `${rotate.value}deg` }],
  }));

  const currentImage = candidates[imageIndex];

  const onImageTap = (tapX: number) => {
    if (candidates.length <= 1) return;
    const goPrev = cardWidth > 0 && tapX < cardWidth / 2;
    setImageFailed(false);
    setImageIndex((prev) => {
      const next = goPrev ? prev - 1 : prev + 1;
      return (next + candidates.length) % candidates.length;
    });
  };

  const onImageError = () => {
    if (imageIndex + 1 < candidates.length) {
      setImageIndex((prev) => prev + 1);
      return;
    }
    setImageFailed(true);
  };

  return (
    <View style={styles.wrapper}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.card, cardStyle]}
          onLayout={(e) => setCardWidth(e.nativeEvent.layout.width)}
        >
          <Pressable style={styles.imagePressable} onPress={(e) => onImageTap(e.nativeEvent.locationX)}>
            {imageFailed || !currentImage ? (
              <View style={styles.imageFallback}>
                <ImageIcon size={28} color="rgba(255,255,255,0.75)" />
                <Text style={styles.imageFallbackText}>No image</Text>
              </View>
            ) : (
              <FastImage
                key={`${currentImage}:${imageIndex}`}
                source={{
                  uri: currentImage,
                  priority: FastImage.priority.high,
                  cache: FastImage.cacheControl.immutable,
                }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
                onError={onImageError}
              />
            )}

            <View pointerEvents="none" style={styles.storyBars}>
              {candidates.map((_, idx) => (
                <View
                  key={idx}
                  style={[styles.storyBar, idx === imageIndex ? styles.storyBarActive : styles.storyBarInactive]}
                />
              ))}
            </View>

            <View pointerEvents="none" style={styles.overlayDim} />
            <View pointerEvents="none" style={styles.overlayFadeTop} />
            <View pointerEvents="none" style={styles.overlayFadeMid} />
            <View pointerEvents="none" style={styles.overlayFadeBottom} />

            <View style={styles.bottom}>
              <View style={styles.metaRow}>
                <View style={styles.wordRow}>
                  <Text style={styles.term} numberOfLines={1}>
                    {term}
                  </Text>
                  {showTranslation ? (
                    <Text style={styles.translation} numberOfLines={1}>
                      {translation}
                    </Text>
                  ) : null}
                  <View style={styles.verified}>
                    <CheckIcon size={14} color="white" />
                  </View>
                </View>

                <Pressable style={styles.infoBtn} onPress={() => setShowTranslation((prev) => !prev)}>
                  <InfoIcon size={20} color={colors.ink} />
                </Pressable>
              </View>

              <View style={styles.chipsRow}>
                {tags.map((tag) => (
                  <View key={tag} style={styles.chip}>
                    <Text style={styles.chipText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '92%',
    height: CARD_HEIGHT,
    borderRadius: radii.xl,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...shadows.medium,
  },
  imagePressable: { flex: 1 },
  image: { width: '100%', height: '100%' },
  imageFallback: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ink,
  },
  imageFallbackText: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: fontFamilies.body,
  },
  storyBars: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  storyBar: {
    flex: 1,
    height: 4,
    borderRadius: 999,
  },
  storyBarActive: { backgroundColor: 'rgba(255,255,255,0.92)' },
  storyBarInactive: { backgroundColor: 'rgba(255,255,255,0.24)' },

  overlayDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  overlayFadeTop: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 180,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  overlayFadeMid: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    height: 120,
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  overlayFadeBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 130,
    backgroundColor: 'rgba(0,0,0,0.46)',
  },

  bottom: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  wordRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  term: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    fontFamily: fontFamilies.display,
    maxWidth: '55%',
  },
  translation: {
    fontSize: 22,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    fontFamily: fontFamilies.heading,
    flex: 1,
  },
  verified: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2B6EF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  chipsRow: {
    marginTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  chipText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
    fontFamily: fontFamilies.heading,
  },
});
