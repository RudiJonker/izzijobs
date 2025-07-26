import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../constants/styles';
import theme from '../constants/theme';
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
      setLoading(false);
    };
    fetchUserRole();
  }, []);

  const handleLogin = async () => {
    console.log('handleLogin called'); // Debug log
    if (loading) {
      console.log('Loading state active'); // Debug log
      Alert.alert('Error', 'Please Wait for Initialization.'); // Capitalized and professional
      return;
    }
    if (!email || !password) {
      console.log('Fields missing:', { email, password }); // Debug log
      Alert.alert('Error', 'Email and Password Are Required.'); // Custom check
      return;
    }
    console.log('Attempting login with userRole:', userRole);
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.log('Login error:', error.message); // Debug log
      Alert.alert('Login Failed', error.message.charAt(0).toUpperCase() + error.message.slice(1) + '.'); // Capitalize Supabase message
    } else {
      console.log('Login successful, session data:', data.session);
      const { data: userData, error: roleError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();
      if (roleError) {
        console.error('Error fetching role post-login:', roleError.message);
        Alert.alert('Error', 'Could Not Fetch Role. Please Contact Support.'); // Capitalized
      } else if (userData.role) {
        setUserRole(userData.role);
        console.log('Set user role post-login:', userData.role);
        if (userData.role === 'seeker') {
          navigation.replace('Seeker');
        } else if (userData.role === 'employer') {
          navigation.replace('Employer');
        }
      } else {
        Alert.alert('Error', 'Role Not Set in User Data. Please Contact Support.'); // Capitalized
      }
    }
  };

  return (
    <View style={[styles.container, { marginTop: -20 }]}>
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
        secureTextEntry
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}