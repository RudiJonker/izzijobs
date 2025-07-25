import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import supabase from '../supabase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('seeker');

  const handleSignup = async () => {
    if (!email || !password || !name || !phone || !location || !role) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      Alert.alert('Signup Failed', authError.message);
    } else {
      const userId = data.user.id;
      const { error: dbError } = await supabase
        .from('users')
        .insert({ id: userId, role, name, email, phone, location });
      if (dbError) {
        Alert.alert('Database Error', dbError.message);
      } else {
        Alert.alert('Success', 'Signup complete! Please log in.');
        navigation.navigate('Login', { role });
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Signup Screen</Text>
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
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
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
      />
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[styles.radioButton, role === 'seeker' && styles.selectedRadio]}
          onPress={() => setRole('seeker')}>
          <Text>Job Seeker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, role === 'employer' && styles.selectedRadio]}
          onPress={() => setRole('employer')}>
          <Text>Employer</Text>
        </TouchableOpacity>
      </View>
      <Button title="Sign Up" onPress={handleSignup} />
      <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
        Already have an account? Log In
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
  radioContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  radioButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedRadio: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  link: {
    color: '#007AFF',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});