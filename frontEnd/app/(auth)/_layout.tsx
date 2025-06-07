import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import {ActivityIndicator, View} from 'react-native'
import {COLORS} from '@/constants/colors';

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()
  if(!isLoaded) {
    return (
    <View style={{flex:1, justifyContent: 'center'}}>
      <ActivityIndicator size={'large'} color={COLORS.primary}/>
    </View>
 
)}
  if (isSignedIn) {
    return <Redirect href={'/'} />
  }
  return  <Stack screenOptions={{headerShown: false}}/>;
}