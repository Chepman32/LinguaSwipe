import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, fontFamilies, radii, shadows, spacing } from '../theme/tokens';
import { getDeckById } from '../data/decks';
import { areLanguageImagesCached, setLanguageImagesCached } from '../services/imageCache';
import { getSettings, subscribeSettings } from '../services/progress';
import LanguageImageDownloader from './LanguageImageDownloader';

export default function OfflineLanguagePackDownloader() {
  const [languageId, setLanguageId] = React.useState('');
  const [languageName, setLanguageName] = React.useState('');

  const [downloadPromptVisible, setDownloadPromptVisible] = React.useState(false);
  const [downloadVisible, setDownloadVisible] = React.useState(false);
  const [downloadActive, setDownloadActive] = React.useState(false);

  const [downloadLanguageId, setDownloadLanguageId] = React.useState('');
  const [downloadTotal, setDownloadTotal] = React.useState(0);
  const [downloadCompleted, setDownloadCompleted] = React.useState(0);
  const [downloadDone, setDownloadDone] = React.useState(false);

  const downloadPercent = downloadTotal ? Math.round((downloadCompleted / downloadTotal) * 100) : 0;

  const checkLanguage = React.useCallback(
    async (id: string) => {
      if (!id) return;

      const deck = getDeckById(id);
      setLanguageId(id);
      setLanguageName(deck.name);

      if (downloadActive) return;

      const cached = await areLanguageImagesCached(id);
      if (!cached) {
        setDownloadTotal(deck.cards.length);
        setDownloadPromptVisible(true);
      } else {
        setDownloadPromptVisible(false);
      }
    },
    [downloadActive],
  );

  React.useEffect(() => {
    getSettings()
      .then((settings) => checkLanguage(settings.languageId))
      .catch((error) => console.warn('getSettings failed', error));

    const unsubscribe = subscribeSettings((next) => {
      checkLanguage(next.languageId).catch((error) => console.warn('checkLanguage failed', error));
    });

    return unsubscribe;
  }, [checkLanguage]);

  const startDownload = () => {
    if (!languageId) return;
    setDownloadLanguageId(languageId);
    setDownloadPromptVisible(false);
    setDownloadVisible(true);
    setDownloadDone(false);
    setDownloadCompleted(0);
    setDownloadActive(true);
  };

  return (
    <>
      <Modal
        visible={downloadPromptVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDownloadPromptVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Download {languageName} pack?</Text>
            <Text style={styles.modalDesc}>
              Save {downloadTotal || 'all'} images for offline mode. You can keep using the app while it downloads.
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalSecondaryBtn} onPress={() => setDownloadPromptVisible(false)}>
                <Text style={styles.modalSecondaryText}>Not now</Text>
              </Pressable>
              <Pressable style={styles.modalPrimaryBtn} onPress={startDownload}>
                <Text style={styles.modalPrimaryText}>Download</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={downloadVisible}
        animationType="slide"
        onRequestClose={() => setDownloadVisible(false)}
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.downloadScreen}>
          <View style={styles.downloadHeader}>
            <Text style={styles.downloadTitle}>{downloadDone ? 'Download complete' : 'Downloading...'}</Text>
            <Text style={styles.downloadSubtitle}>
              {downloadCompleted} / {downloadTotal} images · {downloadPercent}%
            </Text>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${downloadPercent}%` }]} />
          </View>

          <Pressable style={styles.downloadBtn} onPress={() => setDownloadVisible(false)}>
            <Text style={styles.downloadBtnText}>
              {downloadDone ? 'Continue' : 'Continue downloading in background mode'}
            </Text>
          </Pressable>
        </SafeAreaView>
      </Modal>

      {downloadLanguageId ? (
        <LanguageImageDownloader
          languageId={downloadLanguageId}
          active={downloadActive}
          onProgress={(completed, total) => {
            setDownloadCompleted(completed);
            setDownloadTotal(total);
          }}
          onDone={() => {
            setDownloadActive(false);
            setDownloadDone(true);
            setLanguageImagesCached(downloadLanguageId, true).catch((error) => {
              console.warn('setLanguageImagesCached failed', error);
            });
          }}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11,16,33,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.medium,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.text, fontFamily: fontFamilies.heading },
  modalDesc: { marginTop: spacing.sm, fontSize: 14, color: colors.muted, fontFamily: fontFamilies.body, lineHeight: 20 },
  modalActions: { marginTop: spacing.lg, flexDirection: 'row', gap: spacing.md, justifyContent: 'flex-end' },
  modalSecondaryBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: '#E9EDFB' },
  modalSecondaryText: { color: colors.primaryDark, fontWeight: '700', fontFamily: fontFamilies.heading },
  modalPrimaryBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, backgroundColor: colors.primary },
  modalPrimaryText: { color: 'white', fontWeight: '700', fontFamily: fontFamilies.heading },

  downloadScreen: { flex: 1, backgroundColor: colors.background, padding: spacing.xl, justifyContent: 'center' },
  downloadHeader: { alignItems: 'center' },
  downloadTitle: { fontSize: 26, fontWeight: '800', color: colors.text, fontFamily: fontFamilies.display, textAlign: 'center' },
  downloadSubtitle: { marginTop: spacing.sm, fontSize: 14, color: colors.muted, fontFamily: fontFamilies.body, textAlign: 'center' },
  progressTrack: {
    marginTop: spacing.xl,
    height: 14,
    borderRadius: 999,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 999,
  },
  downloadBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  downloadBtnText: { color: colors.text, fontWeight: '800', fontFamily: fontFamilies.heading, textAlign: 'center' },
});

