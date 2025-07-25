import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import supabase from '../supabase';

export default function LoginScreen({ navigation, route }) {
  const { role: initialRole } = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState(initialRole);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', session ? 'Active' : 'Inactive');
      if (session?.user) {
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (error) {
          console.error('Error fetching role:', error.message);
        } else if (data.role) {
          setUserRole(data.role);
          console.log('Fetched user role:', data.role);
        } else {
          console.warn('No role found for user:', session.user.id);
        }
      }
      setLoading(false); // Enable login after initial check
    };
    fetchUserRole();
  }, []);

  const handleLogin = async () => {
    if (loading) {
      Alert.alert('Error', 'Please wait for initialization.');
      return;
    }
    console.log('Attempting login with userRole:', userRole);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      Alert.alert('Login Failed', error.message);
    } else {
      console.log('Login successful, session data:', data.session);
      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();
      if (roleError) {
        console.error('Error fetching role post-login:', roleError.message);
        Alert.alert('Error', 'Could not fetch role. Please contact support.');
      } else if (userData.role) {
        setUserRole(userData.role);
        console.log('Set user role post-login:', userData.role);
        if (userData.role === 'seeker') {
          navigation.replace('Seeker');
        } else if (userData.role === 'employer') {
          navigation.replace('Employer');
        }
      } else {
        Alert.alert('Error', 'Role not set in user data. Please contact support.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Login Screen</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
  },
  link: {
    color: '#48d22b',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});