import { Tabs } from 'expo-router';
import { cores } from '../../src/theme';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: cores.campo,
          borderTopColor: cores.borda,
        },
        tabBarActiveTintColor: cores.acento,
        tabBarInactiveTintColor: cores.suave,
      }}
    >
      <Tabs.Screen name="cotacao" options={{ title: 'Cotação' }} />
    </Tabs>
  );
}