import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#121212' },
        tabBarActiveTintColor: 'rgba(0,255,0,0.6)',
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
        }}
      />

      <Tabs.Screen
        name="favourite"
        options={{
          title: 'Favourite',
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}