import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { styles } from '../constants/styles';
import supabase from '../supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('handleLogin called with email:', email);
    if (!email || !password) {
      console.log('Fields missing:', { email, password });
      Alert.alert('Error', 'Email and Password are required.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Supabase auth error:', error.message);
      Alert.alert('Login Failed', error.message.charAt(0).toUpperCase() + error.message.slice(1) + '.');
    } else {
      console.log('Supabase login successful for user ID:', data.user.id);
      const userId = data.user.id;
      const { data: userData, error: dbError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (dbError) {
        console.log('Database error fetching role:', dbError.message);
        Alert.alert('Error', 'Could not fetch user role.');
      } else {
        const role = userData.role;
        console.log(`User logged in as ${role} with ID:`, userId);
        console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} directed to homepage`);
        navigation.reset({
  index: 0,
  routes: [{ name: 'Main', params: { role: 'employer' } }],
});
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
    >
      <View style={styles.container}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Izzijobs</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry={true}
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={[styles.link, { textAlign: 'center' }]}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}