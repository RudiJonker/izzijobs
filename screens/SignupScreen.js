import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { styles } from '../constants/styles';
import supabase from '../supabase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('seeker');

  const handleSignup = async () => {
    console.log('handleSignup called with role:', role);
    if (!email || !password || !name || !phone || !role) {
      console.log('Fields missing:', { email, password, name, phone, role });
      Alert.alert('Error', 'All Fields Are Required.');
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      console.log('Supabase auth error:', authError.message);
      Alert.alert('Signup Failed', authError.message.charAt(0).toUpperCase() + authError.message.slice(1) + '.');
    } else {
      const userId = data.user.id;
      console.log(`New user signed up as ${role} with ID:`, userId);
      const { error: dbError } = await supabase
        .from('users')
        .insert({ id: userId, role, name, email, phone });
      if (dbError) {
        console.log('Database error:', dbError.message);
        Alert.alert('Database Error', dbError.message.charAt(0).toUpperCase() + dbError.message.slice(1) + '.');
      } else {
        console.log('User data inserted successfully for role:', role);
        Alert.alert('Success', 'Signup Complete! Please Log In.');
        navigation.navigate('Login', { role });
      }
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps='handled' style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ padding: 20 }}>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder='Email'
          autoCapitalize='none'
          keyboardType='email-address'
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder='Password'
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder='Name'
        />
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder='Phone'
          keyboardType='phone-pad'
        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
          <TouchableOpacity
            style={[styles.radioButton, role === 'seeker' && styles.radioSelected]}
            onPress={() => setRole('seeker')}
          >
            <View style={styles.radioCircle} />
          </TouchableOpacity>
          <Text style={{ marginRight: 20 }}>Job Seeker</Text>
          <TouchableOpacity
            style={[styles.radioButton, role === 'employer' && styles.radioSelected]}
            onPress={() => setRole('employer')}
          >
            <View style={styles.radioCircle} />
          </TouchableOpacity>
          <Text>Employer</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Sign Up</Text>
        </TouchableOpacity>
        <Text
          style={[styles.link, { textAlign: 'center', marginBottom: 20 }]}
          onPress={() => navigation.navigate('Login')}
        >
          Already have an account? Log In
        </Text>
      </View>
    </ScrollView>
  );
}