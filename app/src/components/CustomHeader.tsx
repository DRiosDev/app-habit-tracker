import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import SettingsModal from "./modals/SettingsModal";

export default function CustomHeader() {
  const [settingsVisible, setSettingsVisible] = useState(false);

  const toggleSettings = () => {
    setSettingsVisible((prev) => !prev);
  };

  return (
    <SafeAreaView className="flex flex-row justify-between items-center p-2">
      <View className="flex flex-col">
        <Text className="text-xs">Header</Text>
        <Text className="text-2xl">Header big title</Text>
      </View>

      <IconButton
        icon="cog-box"
        iconColor={settingsVisible ? "#E91E63" : "#777"}
        size={26}
        onPress={toggleSettings}
      />

      <SettingsModal
        visible={settingsVisible}
        onDismiss={() => setSettingsVisible(false)}
      />
    </SafeAreaView>
  );
}
