import React, { useState } from "react";
import { View } from "react-native";
import { List, Switch, Divider, SegmentedButtons, Text } from "react-native-paper";
import { useColorScheme } from "@/src/components/useColorScheme";
import HeaderModal from "./HeaderModal";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  headerHeight?: number;
  topOffset?: number;
};

type ThemeOption = "system" | "light" | "dark";

export default function SettingsModal({
  visible,
  onDismiss,
  headerHeight,
  topOffset,
}: Props) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeOption>("system");
  const [notifications, setNotifications] = useState(true);

  const handleThemeChange = (value: string) => {
    const selected = value as ThemeOption;
    setThemeMode(selected);
    setColorScheme(selected);
  };

  return (
    <HeaderModal
      visible={visible}
      onDismiss={onDismiss}
      headerHeight={headerHeight}
      topOffset={topOffset}
      title="Configuraciones"
      overlayOpacity={0.85}
    >
      <View className="flex flex-col gap-3">
        <View className="flex flex-col gap-2">
          <View className="flex flex-row justify-between items-center px-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Tema de la aplicación
            </Text>
            <Text className="text-xs text-slate-500 capitalize">
              {themeMode === "system"
                ? `Auto (${colorScheme})`
                : themeMode === "dark"
                ? "Oscuro"
                : "Claro"}
            </Text>
          </View>

          <SegmentedButtons
            value={themeMode}
            onValueChange={handleThemeChange}
            buttons={[
              {
                value: "system",
                label: "Auto",
                icon: "cellphone-cog",
              },
              {
                value: "light",
                label: "Claro",
                icon: "white-balance-sunny",
              },
              {
                value: "dark",
                label: "Oscuro",
                icon: "weather-night",
              },
            ]}
            density="small"
          />
        </View>

        <Divider />

        <List.Item
          title="Notificaciones"
          description="Recordatorios diarios de hábitos"
          left={(props) => <List.Icon {...props} icon="bell-outline" />}
          right={() => (
            <Switch
              value={notifications}
              onValueChange={() => setNotifications(!notifications)}
            />
          )}
        />
      </View>
    </HeaderModal>
  );
}
