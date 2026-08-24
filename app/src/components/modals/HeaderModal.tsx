import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Portal, Text } from "react-native-paper";

type HeaderModalProps = {
  visible: boolean;
  onDismiss: () => void;
  headerHeight?: number;
  topOffset?: number;
  children: React.ReactNode;
  title?: string;
  overlayOpacity?: number;
  contentContainerStyle?: string;
};

export default function HeaderModal({
  visible,
  onDismiss,
  headerHeight = 0,
  topOffset = 0,
  children,
  title,
  overlayOpacity = 0.85,
  contentContainerStyle = "",
}: HeaderModalProps) {
  if (!visible) return null;

  const actualTop = headerHeight + topOffset;

  return (
    <Portal>
      <View
        style={[styles.portalContainer, { top: actualTop }]}
        pointerEvents="box-none"
      >
        {/* Dark Backdrop covering screen below header */}
        <Pressable
          onPress={onDismiss}
          style={[
            styles.backdrop,
            { backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` },
          ]}
        />

        {/* Modal Card Content positioned below header */}
        <View
          style={styles.card}
          className={`bg-white dark:bg-slate-900 mx-4 mt-2 p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 ${contentContainerStyle}`}
        >
          {title && (
            <View className="mb-3 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Text className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {title}
              </Text>
            </View>
          )}
          {children}
        </View>
      </View>
    </Portal>
  );
}

const styles = StyleSheet.create({
  portalContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  card: {
    zIndex: 2,
    elevation: 10,
  },
});
