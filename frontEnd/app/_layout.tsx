import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'

export default function RootLayout() {
  console.log("##----1-----");
  
  return (
   <ClerkProvider tokenCache={tokenCache}>
    <SafeAreaView style={{flex: 1}}>
      <Slot />
    </SafeAreaView>
    </ClerkProvider>
)
}
