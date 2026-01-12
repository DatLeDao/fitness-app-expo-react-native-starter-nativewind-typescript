import { useAuth } from '@clerk/clerk-expo';
import { Stack } from 'expo-router'
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View } from 'react-native';

export default function Layout() {
  const {isLoaded, isSignedIn, userId, sessionId, getToken} = useAuth();

  console.log('isSignedIn >>>', isSignedIn);

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    )
  }

  return (
    <Stack>
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
        <Stack.Screen 
          name="exercise-detail" 
          options={{headerShown:false, presentation: "modal", gestureEnabled: true, animationTypeForReplace: "push"}} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="sign-in" options={{headerShown:false}} />
        <Stack.Screen name="sign-up" options={{headerShown:false}} />
      </Stack.Protected>
    </Stack>
  );
}