import Colors from "@/constants/Colors";
import CustomHeader from "@/src/components/CustomHeader";
import { useColorScheme } from "@/src/components/useColorScheme";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        header: () => <CustomHeader />,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen
        name="two"
        options={{
          title: "Hola mundo",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="modalCUHabit"
        options={{
          title: "Crear hábito",
          href: null,
        }}
      />
    </Tabs>
  );
}
