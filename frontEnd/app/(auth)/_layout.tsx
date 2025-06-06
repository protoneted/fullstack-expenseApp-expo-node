import { Redirect, Stack } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function AuthRoutesLayout() {
  console.log("##----4-----");

  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }
  return  <Stack />;

  return  <Stack screenOptions={{headerShown: false}}/>;
}