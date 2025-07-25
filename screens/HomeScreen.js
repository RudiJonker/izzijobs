import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import theme from '../constants/theme';

export default function HomeScreen() {
  const route = useRoute();
  const { role } = route.params || { role: 'seeker' };
  console.log('HomeScreen role:', role);

  const renderSeekerContent = () => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Available Jobs (0)</Text>
    </View>
  );

  const renderEmployerContent = () => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Posted Jobs (0)</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Dashboard</Text>
      {role === 'seeker' ? renderSeekerContent() : renderEmployerContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.sizes.large,
    fontFamily: theme.fonts.family,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: theme.colors.background,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  cardText: {
    fontSize: theme.sizes.medium,
    color: theme.colors.text,
  },
});