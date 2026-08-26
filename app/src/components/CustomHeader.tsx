import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsModal from "./modals/SettingsModal";

const getFormattedDate = (): string => {
  const date = new Date();
  const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
  const dayNum = date.getDate();
  const monthName = date.toLocaleDateString("es-ES", { month: "long" });

  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1);
  const capitalizedMonth =
    monthName.charAt(0).toUpperCase() + monthName.slice(1);

  return `${capitalizedDay}, ${dayNum} ${capitalizedMonth}`;
};

export default function CustomHeader() {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  useEffect(() => {
    // Actualizar la fecha en tiempo real cada minuto
    const interval = setInterval(() => {
      setCurrentDate(getFormattedDate());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const toggleSettings = () => {
    setSettingsVisible((prev) => !prev);
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== headerHeight) {
      setHeaderHeight(height);
    }
  };

  return (
    <View onLayout={handleLayout} style={styles.headerWrapper}>
      <SafeAreaView
        edges={["top", "left", "right"]}
        className="flex flex-row justify-between items-center px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800"
      >
        <View className="flex flex-col">
          <Text className="text-xl font-medium text-slate-500 dark:text-slate-400 capitalize">
            {currentDate}
          </Text>
          <Text className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Mis Hábitos
          </Text>
        </View>

        <IconButton
          icon={settingsVisible ? "cog-box" : "cog-box"}
          iconColor={settingsVisible ? "#E91E63" : "#777"}
          size={26}
          onPress={toggleSettings}
        />
      </SafeAreaView>

      <SettingsModal
        visible={settingsVisible}
        onDismiss={() => setSettingsVisible(false)}
        headerHeight={headerHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    width: "100%",
  },
});
