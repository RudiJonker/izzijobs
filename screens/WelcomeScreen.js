// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';
import theme from '../constants/theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={{ uri: 'https://via.placeholder.com/150' }} // Replace with your logo URL
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to izzijobs!</Text>
      <Text style={styles.tagline}>Casual work at your fingertips!</Text>
      <Button title="Get Started!" onPress={() => navigation.navigate('Signup')} color={theme.colors.primary} />
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
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: -60,
  },
  title: {
    fontSize: theme.sizes.large,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
});