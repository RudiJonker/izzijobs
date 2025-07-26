import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { styles } from '../constants/styles';
import theme from '../constants/theme';
import supabase from '../supabase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('seeker');

  const handleSignup = async () => {
    console.log('handleSignup called'); // Debug log
    if (!email || !password || !name || !phone || !location || !role) {
      console.log('Fields missing:', { email, password, name, phone, location, role }); // Debug log
      Alert.alert('Error', 'All Fields Are Required.'); // Capitalized and professional
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      console.log('Supabase error:', authError.message); // Debug log for exact message
      Alert.alert('Signup Failed', authError.message.charAt(0).toUpperCase() + authError.message.slice(1) + '.'); // Capitalize Supabase message
    } else {
      const userId = data.user.id;
      const { error: dbError } = await supabase
        .from('users')
        .insert({ id: userId, role, name, email, phone, location });
      if (dbError) {
        console.log('Database error:', dbError.message); // Debug log for insert error
        Alert.alert('Database Error', dbError.message.charAt(0).toUpperCase() + dbError.message.slice(1) + '.'); // Capitalize DB message
      } else {
        Alert.alert('Success', 'Signup Complete! Please Log In.'); // Capitalized and professional
        navigation.navigate('Login', { role });
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: 0, marginTop: -20 }]}>
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
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        placeholder="Phone"
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Location"
        keyboardType="email-address"
      />
      <View style={[styles.radioContainer, { marginTop: 20, marginBottom: 10 }]}>
        <TouchableOpacity
          style={[styles.radioButton, role === 'seeker' && styles.radioSelected, { marginRight: 8 }]}
          onPress={() => setRole('seeker')}>
          <View style={styles.radioCircle} />
        </TouchableOpacity>
        <Text>Job Seeker</Text>
        <TouchableOpacity
          style={[styles.radioButton, role === 'employer' && styles.radioSelected, { marginLeft: 20, marginRight: 8 }]}
          onPress={() => setRole('employer')}>
          <View style={styles.radioCircle} />
        </TouchableOpacity>
        <Text>Employer</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Sign Up</Text>
      </TouchableOpacity>
      <Text style={[styles.link, { marginTop: 20, marginBottom: 10 }]} onPress={() => navigation.navigate('Login')}>
        <Text>Already have an account? Log In</Text>
      </Text>
    </View>
  );
}