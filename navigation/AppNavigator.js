import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignupScreen from '../screens/SignupScreen';
import LoginScreen from '../screens/LoginScreen';
import SeekerNavigator from './SeekerNavigator';
import EmployerNavigator from './EmployerNavigator';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Seeker" component={SeekerNavigator} options={{ headerShown: true }} />
      <Stack.Screen name="Employer" component={EmployerNavigator} options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}