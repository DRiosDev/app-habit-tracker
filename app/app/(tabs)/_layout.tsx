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
      <Tabs.Screen
        name="index"
        options={{
          title: "Hoy",
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar-check-o" color={color} />,
        }}
      />
      <Tabs.Screen
        name="habitos"
        options={{
          title: "Mis Hábitos",
          tabBarIcon: ({ color }) => <TabBarIcon name="list-ul" color={color} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          href: null,
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
