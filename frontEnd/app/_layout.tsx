import {SafeAreaView} from "react-native-safe-area-context";
import {tokenCache} from '@clerk/clerk-expo/token-cache'
import {ClerkProvider} from '@clerk/clerk-expo'
import {Slot} from 'expo-router'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider tokenCache={tokenCache}>
        <SafeAreaView style={{flex: 1}}>
          <Slot />
        </SafeAreaView>
      </ClerkProvider>
    </QueryClientProvider>
  )
}
