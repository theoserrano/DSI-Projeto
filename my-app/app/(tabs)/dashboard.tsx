import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { BottomNav } from '@/components/navigation/BottomNav';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const theme = useTheme();

  const icons_navbar = [
    { icon: 'home-outline', path: '/(tabs)/home' },
    { icon: 'search-outline', path: '/(tabs)/search' },
    { icon: 'add-circle', path: '/(tabs)/add' },
    { icon: 'person-outline', path: '/(tabs)/profile' },
    { icon: 'stats-chart-outline', path: '/(tabs)/dashboard' },
  ];

  return (
    <SafeAreaView 
      edges={["top"]} 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.centerContent}>
          <View style={[styles.iconContainer, { 
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.primary,
          }]}>
            <Ionicons name="stats-chart" size={64} color={theme.colors.primary} />
          </View>
          <Text style={[styles.title, { 
            color: theme.colors.primary,
            fontFamily: 'SansationBold',
          }]}>
            Dashboard
          </Text>
          <Text style={[styles.subtitle, { 
            color: theme.colors.muted,
            fontFamily: 'Sansation',
          }]}>
            Estatísticas e análises em breve
          </Text>
        </View>
      </View>

      <BottomNav tabs={icons_navbar as any} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
});
