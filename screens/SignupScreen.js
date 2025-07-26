import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { styles } from '../constants/styles';
import theme from '../constants/theme';
import supabase from '../supabase';
import { GEOAPIFY_API_KEY } from '@env';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('seeker');
  const [suggestions, setSuggestions] = useState([]);

  const handleSignup = async () => {
    console.log('handleSignup called');
    if (!email || !password || !name || !phone || !location || !role) {
      console.log('Fields missing:', { email, password, name, phone, location, role });
      Alert.alert('Error', 'All Fields Are Required.');
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      console.log('Supabase error:', authError.message);
      Alert.alert('Signup Failed', authError.message.charAt(0).toUpperCase() + authError.message.slice(1) + '.');
    } else {
      const userId = data.user.id;
      const { error: dbError } = await supabase
        .from('users')
        .insert({ id: userId, role, name, email, phone, location });
      if (dbError) {
        console.log('Database error:', dbError.message);
        Alert.alert('Database Error', dbError.message.charAt(0).toUpperCase() + dbError.message.slice(1) + '.');
      } else {
        Alert.alert('Success', 'Signup Complete! Please Log In.');
        navigation.navigate('Login', { role });
      }
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}`
      );
      const data = await response.json();
      if (data.features) {
        setSuggestions(data.features.map((feature) => ({
          formatted: feature.properties.formatted,
          id: feature.properties.place_id,
        })));
      }
    } catch (error) {
      console.log('Error fetching suggestions:', error.message);
      setSuggestions([]);
    }
  };

  const handleLocationChange = (text) => {
    setLocation(text);
    fetchSuggestions(text);
  };

  const selectSuggestion = (suggestion) => {
    setLocation(suggestion.formatted);
    setSuggestions([]);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 40}
    >
      <View style={[styles.container, { paddingTop: 0, marginTop: 40 }]}>
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
          style={[styles.input, { textAlign: 'left', width: Dimensions.get('window').width - 40, paddingLeft: 10 }]}
          value={location}
          onChangeText={handleLocationChange}
          placeholder="Enter location"
          autoCapitalize="none"
        />
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.input, { backgroundColor: '#f0f0f0', marginVertical: 2 }]}
              onPress={() => selectSuggestion(item)}
            >
              <Text>{item.formatted}</Text>
            </TouchableOpacity>
          )}
          style={{ maxHeight: 150, zIndex: 1000 }}
        />
        <View style={[styles.radioContainer, { marginTop: 20, marginBottom: 10 }]}>
          <TouchableOpacity
            style={[styles.radioButton, role === 'seeker' && styles.radioSelected, { marginRight: 8 }]}
            onPress={() => setRole('seeker')}
          >
            <View style={styles.radioCircle} />
          </TouchableOpacity>
          <Text>Job Seeker</Text>
          <TouchableOpacity
            style={[styles.radioButton, role === 'employer' && styles.radioSelected, { marginLeft: 20, marginRight: 8 }]}
            onPress={() => setRole('employer')}
          >
            <View style={styles.radioCircle} />
          </TouchableOpacity>
          <Text>Employer</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Sign Up</Text>
        </TouchableOpacity>
        <Text style={[styles.link, { marginTop: 10, marginBottom: 20 }]} onPress={() => navigation.navigate('Login')}>
          Already have an account? Log In
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}