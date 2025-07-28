import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'; // Replace with SeekerHomeScreen if different

const Tab = createBottomTabNavigator();

export default function SeekerNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        initialParams={{ role: 'seeker' }}
        options={{
          headerShown: false,
          tabBarLabel: '', // Optional: hides "Home" label under tab icon
        }} 
      />
    </Tab.Navigator>
  );
}
