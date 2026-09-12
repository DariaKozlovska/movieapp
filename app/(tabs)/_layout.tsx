import { Colors } from '@/constants/colors';
import { Tabs } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: Colors.background, borderColor: 'transparent', marginBottom: 0, height: 60 },
        tabBarActiveTintColor: Colors.green,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/Sorting-Arrows-Horizontal.png')}
              style={[styles.icon, { tintColor: focused ? Colors.green : Colors.disactiveTab }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/Users.png')}
              style={[styles.icon, { tintColor: focused ? Colors.green : Colors.disactiveTab }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="favourite"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/Love.png')}
              style={[styles.icon, { tintColor: focused ? Colors.green : Colors.disactiveTab }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/Time-Machine.png')}
              style={[styles.icon, { tintColor: focused ? Colors.green : Colors.disactiveTab }]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={require('@/assets/images/Settings.png')}
              style={[styles.icon, { tintColor: focused ? Colors.green : Colors.disactiveTab }]}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 32,
    height: 32,
  },
});