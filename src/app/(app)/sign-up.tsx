import * as React from 'react'
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

export default function SignUpScreen() {
    const { isLoaded, signUp, setActive } = useSignUp()
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)

    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [pendingVerification, setPendingVerification] = React.useState(false)
    const [code, setCode] = React.useState('')

    // Handle submission of sign-up form
    const onSignUpPress = async () => {
        if (!isLoaded) return;
        if (!emailAddress || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        setIsLoading(true);

        console.log(emailAddress, password)

        // Start sign-up process using email and password provided
        try {
            await signUp.create({
                emailAddress,
                password,
            })

            // Send user an email with verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Set 'pendingVerification' to true to display second form
            // and capture code
            setPendingVerification(true)
        } catch (err) {
            // See https://clerk.com/docs/guides/development/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsLoading(false);
        }
    }

    // Handle submission of verification form
    const onVerifyPress = async () => {
        if (!isLoaded) return;
        if (!code) {
            Alert.alert('Error', 'Please enter the verification code.');
            return;
        }
        setIsLoading(true);

        try {
            // Use the code the user provided to attempt verification
            const signUpAttempt = await signUp.attemptEmailAddressVerification({
                code,
            })

            // If verification was completed, set the session to active
            // and redirect the user
            if (signUpAttempt.status === 'complete') {
                await setActive({ session: signUpAttempt.createdSessionId })
                router.replace('/')
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signUpAttempt, null, 2))
            }
        } catch (err) {
            // See https://clerk.com/docs/guides/development/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2))
        } finally {
            setIsLoading(false);
        }
    }

    if (pendingVerification) {
        return (
            <SafeAreaView className='flex-1 bg-gray-50'>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                    className='flex-1'
                >
                    <View className="flex-1 px-6">
                        <View className="flex-1 justify-center">
                            <View className="items-center mb-8">
                                <View>
                                    <Ionicons name="mail" size={40} color="black" />
                                </View>
                                <Text className="text-3xl font-bold text-gray-900 mb-2">
                                    Check your email
                                </Text>
                                <Text className="text-lgtext-gray-600 text-center">
                                    We've sent verification code to {"\n"}
                                    {emailAddress}
                                </Text>
                            </View>

                            {/* Verification Form */}
                            <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                    Enter Verification Code
                                </Text>

                                {/* Verification Code Input  */}
                                <View className="mb-4">
                                    <Text className="text-sm font-medium text-gray-700 mb-2">
                                        Verification Code
                                    </Text>
                                    <View className="flex-row items-center border border-gray-50 rounded-xl px-4 py-4 border border-gray-200">
                                        <Ionicons name="key-outline" size={20} color="#6B7280  " />
                                        <TextInput
                                            value={code}
                                            placeholder="Enter your verification code"
                                            placeholderTextColor="#9CA3AF"
                                            onChangeText={setCode}
                                            className="flex-1 ml-3 text-gray-900"
                                            maxLength={6}
                                            editable={!isLoading}
                                        />
                                    </View>
                                </View>

                                {/* Sign-in button */}

                                <TouchableOpacity
                                    onPress={onVerifyPress}
                                    disabled={isLoading}
                                    className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? "bg-gray-400" : "bg-green-600"
                                        }`}
                                    activeOpacity={0.8}
                                >
                                    <View className="flex-row justify-center items-center">
                                        {isLoading ? (
                                            <Ionicons name="refresh" size={20} color="white" />
                                        ) : (
                                            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                                        )}
                                        <Text className="text-white text-lg font-semibold ml-2">
                                            {isLoading ? 'Verifying...' : 'Verify Email'}
                                        </Text>
                                    </View>
                                </TouchableOpacity>

                                {/* Resend Code Link */}
                                <View className="flex-row justify-center items-center mt-2">
                                    <Text className="text-gray-600">Didn't receive the code?</Text>
                                    <TouchableOpacity onPress={onSignUpPress}>
                                        <Text className="text-blue-600 font-semibold ml-2">Resend Code</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Footer section */}
                        <View className='mt-4'>
                            <Text className="text-center text-gray-500 text-sm">
                                Almost there! Just 1 more step
                            </Text>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className='flex-1 bg-gray-50'>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                className='flex-1'
            >
                <View className="flex-1 px-6">
                    {/* Main */}
                    <View className="flex-1 justify-center">
                        {/* Logo/Branding */}
                        <View className="items-center mb-8">
                            <View>
                                <Ionicons name="fitness" size={40} color="black" />
                            </View>
                            <Text className="text-3xl font-bold text-gray-900 mb-2">
                                Join FitTracker
                            </Text>
                            <Text className="text-lgtext-gray-600 text-center">
                                Start your fitness journey{"\n"}and achieve your goals
                            </Text>
                        </View>
                        {/* Sign-up form */}
                        <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <Text className="text-2xl font-bold text-gray-900 mb-6 text-center">
                                Create Your Account!
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
                                <Text className="mt-1 text-xs text-gray-500">
                                    Must be at least 8 characters.
                                </Text>
                            </View>

                            {/* Sign-in button */}

                            <TouchableOpacity
                                onPress={onSignUpPress}
                                disabled={isLoading}
                                className={`rounded-xl py-4 shadow-sm mb-4 ${isLoading ? "bg-gray-400" : "bg-blue-600"
                                    }`}
                                activeOpacity={0.8}
                            >
                                <View className="flex-row justify-center items-center">
                                    {isLoading ? (
                                        <Ionicons name="refresh" size={20} color="white" />
                                    ) : (
                                        <Ionicons name="person-add-outline" size={20} color="white" />
                                    )}
                                    <Text className="text-white text-lg font-semibold ml-2">
                                        {isLoading ? 'Creating Account...' : 'Create Account'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Sign up link */}
                        <View className="flex-row justify-center items-center mt-2 mb-4">
                            <Text className="text-gray-600">Aready have an account?</Text>
                            <Link href="/sign-in" asChild>
                                <TouchableOpacity>
                                    <Text className="text-blue-600 font-semibold ml-2">Sign In</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                    {/* Footer section */}
                    <View className='mt-4'>
                        <Text className="text-center text-gray-500 text-sm">
                            Almost there! Just 1 more step
                        </Text>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}