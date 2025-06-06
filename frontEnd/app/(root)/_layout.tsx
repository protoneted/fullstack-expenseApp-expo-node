import { useUser } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Stack } from "expo-router";

const Layout = () => {
    console.log("##----2-----");

    const {isSignedIn} = useUser();

    if (isSignedIn) return <Redirect href={"/sign-in"}/>;
      return  <Stack />;

  return  <Stack screenOptions={{headerShown: false}}/>;
}

export default Layout