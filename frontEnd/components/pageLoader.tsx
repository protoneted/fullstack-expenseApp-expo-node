import {styles} from "@/assets/styles/home.styles"
import {COLORS} from "@/constants/colors"
import {ActivityIndicator, View} from "react-native"

export const PageLoader = () => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size={"large"} color={COLORS.primary}/>
        </View>
    )
}