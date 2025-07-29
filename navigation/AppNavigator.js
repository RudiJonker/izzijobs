import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import TermsScreen from '../screens/TermsScreen';
import ShareScreen from '../screens/ShareScreen';
import SeekerProfileScreen from '../screens/SeekerProfileScreen';
import EmployerProfileScreen from '../screens/EmployerProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function ProfileScreen({ route }) {
  const { role } = route.params || {};
  console.log('ProfileScreen loaded with role:', role || 'undefined');
  if (!role) {
    console.log('Error: No role provided to ProfileScreen');
    return <Text>Error: User role not found</Text>;
  }
  return role === 'employer' ? <EmployerProfileScreen /> : <SeekerProfileScreen />;
}

function MainTabs({ route }) {
  const { role } = route.params || {};
  console.log('MainTabs loaded with role:', role || 'undefined');
  if (!role) {
    console.log('Error: No role provided to MainTabs');
    return <Text>Error: User role not found</Text>;
  }
  console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} bottom navigation tabs loaded`);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Chat') iconName = 'chat';
          if (route.name === 'Profile') iconName = 'account';
          if (route.name === 'Terms') iconName = 'file-document';
          if (route.name === 'Share') iconName = 'share';
          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} initialParams={{ role }} />
      <Tab.Screen name="Chat" component={ChatScreen} initialParams={{ role }} />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ role }}
        listeners={{
          tabPress: () => console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} pressed Profile tab`),
        }}
      />
      <Tab.Screen name="Terms" component={TermsScreen} initialParams={{ role }} />
      <Tab.Screen name="Share" component={ShareScreen} initialParams={{ role }} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}