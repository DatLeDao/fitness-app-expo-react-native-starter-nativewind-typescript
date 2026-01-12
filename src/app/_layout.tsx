import "../global.css";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import React from "react";

export default function Layout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
        <Slot />
    </ClerkProvider>
  );
}
