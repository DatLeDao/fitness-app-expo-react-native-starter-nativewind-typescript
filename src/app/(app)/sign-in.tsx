import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View, } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import GoogleSignIn from '../components/GoogleSignIn';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return
    if (!emailAddress || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return
    }

    setIsLoading(true);

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'padding' : 'height'}
        className='flex-1'
      >

        <View className="flex-1 px-6 mt-4">
          {/* Header / Branding Section */}
          <View className="flex-1 justify-center">
            {/* Logo/Branding */}
            <View className="items-center mb-8">
              <View>
                <Ionicons name="fitness" size={40} color="black" />
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                FitTracker
              </Text>
              <Text className="text-lgtext-gray-600 text-center">
                Track your fitness journey{"\n"}and reach your goals
              </Text>
            </View>
          </View>

          {/* Sign-in form */}
          <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Welcome back!
            </Text>

            {/* Email Address Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2">
                Email
              </Text>
              <View className="flex-row items-center border border-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Ionicons name="mail-outline" size={20} color="#6B7280  " />
                <TextInput
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={setEmailAddress}
                  className="flex-1 ml-3 text-gray-900"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input  */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2">
                Password
              </Text>
              <View className="flex-row items-center border border-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280  " />
                <TextInput
                  autoCapitalize="none"
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={setPassword}
                  className="flex-1 ml-3 text-gray-900"
                  secureTextEntry={true}
                  editable={!isLoading}
                />
              </View>
            </View>
          </View>



          {/* Sign-in button */}

          <TouchableOpacity
            onPress={onSignInPress}
            disabled={isLoading}
            className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? "bg-gray-400" : "bg-blue-600"
              }`}
            activeOpacity={0.8}
          >
            <View className="flex-row justify-center items-center">
              {isLoading ? (
                <Ionicons name="refresh" size={20} color="white" />
              ) : (
                <Ionicons name="log-in-outline" size={20} color="white" />
              )}
              <Text className="text-white text-lg font-semibold ml-2">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Devider */}
          <View className="flex-row items-center">
            <View className="flex-1 h-px bg-gray-200" />
            <Text className="px-4 text-gray-500 text-sm">or</Text>
            <View className="flex-1 h-px bg-gray-200" />
          </View>

          {/* Google Sign In Button */}
          <GoogleSignIn />

          {/* Sign up link */}
          <View className="flex-row justify-center items-center mt-2 mb-4">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-blue-600 font-semibold ml-2">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Footer section */}
        <View className='mt-4'>
          <Text className="text-center text-gray-500 text-sm">
            Start your fitness journey today!
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}