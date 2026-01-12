import { client } from "@/lib/sanity/client";
import { GetWorkoutsQueryResult } from "@/lib/sanity/types";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { defineQuery } from "groq";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import { formatDuration } from "lib/utils";

export const getWorkoutsQuery =
  defineQuery(`*[_type == "workout" && userId == $userId] | order(date desc) {
      _id,
      date,
      duration,
      exercises[] {
        exercise-> {
          _id,
          name
        },
        sets[] {
          reps,
          weight,
          weightUnit,
          _type,
          _key
        },
        _type,
        _key
      }
    }
  `);


export default function ProfilePage() {
  const { signOut } = useAuth();
  const [workouts, setWorkouts] = useState<GetWorkoutsQueryResult>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const fetchWorkouts = async () => {
    // Nếu chưa có user hoặc user chưa có id thì không fetch
    if (!user?.id) return;

    try {
      // Gọi Sanity query để lấy workout theo userId
      const results = await client.fetch(getWorkoutsQuery, {
        userId: user.id,
      });

      // Lưu dữ liệu workouts vào state
      setWorkouts(results);
    } catch (error) {
      // Log lỗi nếu có vấn đề khi fetch
      console.error("Error fetching workouts:", error);
    } finally {
      // Tắt loading dù fetch thành công hay thất bại
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [user?.id]);

  // Calculate stats
  const totalWorkouts = workouts.length;

  const totalDuration = workouts.reduce(
    (sum, workout) => sum + (workout.duration || 0),
    0
  );

  const averageDuration =
    totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;

  // Calculate days since joining (using createdAt from Clerk)
  const joinDate = user?.createdAt ? new Date(user.createdAt) : new Date();

  const daysSinceJoining = Math.floor(
    (new Date().getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatJoinDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };



  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          signOut();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0000ff" />
          <Text className="text-gray-500">Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex flex-1">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-8 pb-6">
          <Text className="text-3xl font-bold text-gray-900">
            Profile
          </Text>
          <Text className="text-lg text-gray-600 mt-1">
            Manage your account and stats
          </Text>
        </View>

        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
            <View className="flex-row items-center mb-4">
              <View className="w-16 h-16 bg-blue-600 rounded-full items-center justify-center mr-4">
                <Image
                  source={{
                    uri: user.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                  }}
                  className="rounded-full"
                  style={{ width: 64, height: 64 }}
                />
              </View>

              <View className="flex-1">
                <Text className="text-xl font-semibold text-gray-900">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.firstName || "User"}
                </Text>

                <Text className="text-gray-600">
                  {user?.emailAddresses[0].emailAddress}
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Member since {formatJoinDate(joinDate)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        {/* Stats Overview */}
        <View className="px-6 mb-6">
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-300">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Your Fitness Stats
            </Text>

            <View className="flex-row justify-between">
              {/* Total Workouts */}
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-blue-600">
                  {totalWorkouts}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Total{"\n"}Workouts
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-green-600">
                  {formatDuration(totalDuration)}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Total{"\n"}Time
                </Text>
              </View>

              <View className="items-center flex-1">
                <Text className="text-2xl font-bold text-purple-600">
                  {daysSinceJoining}
                </Text>
                <Text className="text-sm text-gray-600 text-center">
                  Days{"\n"}Active
                </Text>
              </View>
            </View>
            {totalWorkouts > 0 && (
              <View className="mt-4 pt-4 border-t border-gray-100">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-600">
                    Average workout duration:
                  </Text>
                  <Text className="font-semibold text-gray-900">
                    {formatDuration(averageDuration)}
                  </Text>
                </View>
              </View>
            )}

          </View>
        </View>


        {/* Sign Out */}
        <View className="mb-8 px-6">
          <TouchableOpacity
            className="w-full bg-red-600 rounded-2xl p-4 shadow-sm"
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text className="text-white font-semibold text-lg">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
