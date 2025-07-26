import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { styles } from '../constants/styles';
import theme from '../constants/theme';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to Izzijobs</Text>
      <Text style={styles.tagline}>Find work or hire locally, fast!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
        <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;