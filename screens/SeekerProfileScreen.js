import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import supabase from '../supabase';
import { styles } from '../constants/styles';

export default function SeekerProfileScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    console.log('SeekerProfileScreen loaded');
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log('Fetching data for user ID:', user.id);
        const { data, error } = await supabase
          .from('users')
          .select('name, email, phone, bio, profile_pics')
          .eq('id', user.id)
          .single();
        if (error) {
          console.log('Fetch error:', error.message);
          Alert.alert('Error', 'Could not fetch user data.');
        } else {
          console.log('Fetched seeker data:', data);
          setName(data.name || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setBio(data.bio || '');
          if (data.profile_pics) {
            const { data: urlData, error: urlError } = await supabase.storage
              .from('pics')
              .createSignedUrl(data.profile_pics, 60 * 60);
            if (urlError) {
              console.log('Signed URL error:', urlError.message);
              Alert.alert('Error', 'Failed to load profile picture.');
            } else {
              console.log('Signed URL fetched:', urlData.signedUrl);
              setProfilePic(urlData.signedUrl);
            }
          }
        }
      }
    };
    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    console.log('Image pick triggered');
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied for image picker');
        Alert.alert('Error', 'Permission to access photos is required.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType.Images,
        quality: 0.8,
        allowsEditing: true,
      });
      console.log('Picker result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileUri = result.assets[0].uri;
        setProfilePic(fileUri);
        const { data: { user } } = await supabase.auth.getUser();
        const fileName = `public/profile-${user.id}-${Date.now()}.jpg`;
        const fileExt = fileUri.split('.').pop().toLowerCase();
        const mimeType = fileExt === 'jpg' || fileExt === 'jpeg' ? 'image/jpeg' : 'image/png';
        console.log('Preparing to upload file:', fileName);

        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const { error: uploadError } = await supabase.storage
          .from('pics')
          .upload(fileName, fileContent, {
            contentType: mimeType,
            upsert: true,
          });

        if (uploadError) {
          console.log('Upload error:', uploadError.message);
          Alert.alert('Error', 'Failed to upload image: ' + uploadError.message);
          return;
        }

        const { data: urlData, error: urlError } = await supabase.storage
          .from('pics')
          .createSignedUrl(fileName, 60 * 60);
        if (urlError) {
          console.log('Signed URL error:', urlError.message);
          Alert.alert('Error', 'Failed to generate signed URL: ' + urlError.message);
          return;
        }
        console.log('Signed URL:', urlData.signedUrl);

        const { error: updateError } = await supabase
          .from('users')
          .update({ profile_pics: fileName })
          .eq('id', user.id);
        if (updateError) {
          console.log('Database update error:', updateError.message);
          Alert.alert('Error', 'Failed to save profile picture path: ' + updateError.message);
          return;
        }

        setProfilePic(urlData.signedUrl);
        console.log('Profile picture uploaded successfully');
        Alert.alert('Success', 'Profile picture uploaded!');
      } else {
        console.log('Image picker canceled or no assets returned');
      }
    } catch (error) {
      console.log('Image pick error:', error.message);
      Alert.alert('Error', 'Failed to process image: ' + error.message);
    }
  };

  const handleSave = async () => {
    console.log('Saving seeker profile');
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('users')
      .update({ name, email, phone, bio })
      .eq('id', user.id);
    if (error) {
      console.log('Save error:', error.message);
      Alert.alert('Error', 'Save failed.');
    } else {
      console.log('Seeker profile saved');
      Alert.alert('Success', 'Profile saved!');
    }
  };

  const handleLogout = async () => {
    console.log('Logout triggered');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log('Logout error:', error.message);
      Alert.alert('Error', 'Logout failed.');
    } else {
      console.log('Navigating to Welcome screen');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleImagePick}>
        <Image
          source={profilePic ? { uri: profilePic } : require('../assets/default-avatar.png')}
          style={[styles.profilePic, { width: 120, height: 120, borderRadius: 60, alignSelf: 'center', margin: 20 }]}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
      </TouchableOpacity>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Name" />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" keyboardType="phone-pad" />
      <TextInput style={styles.input} value={bio} onChangeText={setBio} placeholder="Bio (optional)" multiline />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={{ color: '#fff', textAlign: 'center', padding: 10 }}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}