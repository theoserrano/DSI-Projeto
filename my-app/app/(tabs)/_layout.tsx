import { Tabs } from "expo-router";
import React from "react";
import { BottomNav } from "@/components/navigation/BottomNav";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" }, // escondemos o tabBar nativo
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="search" options={{ title: "Search" }} />
      <Tabs.Screen name="add" options={{ title: "Create" }} />
      <Tabs.Screen name="shows" options={{ title: "Shows" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
    </Tabs>
  );
}
