import {styles} from "@/assets/styles/home.styles"
import {COLORS} from "@/constants/colors"
import {Ionicons} from "@expo/vector-icons"
import {router} from "expo-router"
import {Text, TouchableOpacity, View} from "react-native"

export const EmptyList = () => {
    return (
        <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={60} color={COLORS.textLight} style={styles.emptyStateIcon} />
            <Text style={styles.emptyStateTitle}>No transactions yet</Text>
            <Text style={styles.emptyStateText}>
                Start tracking you finances by adding you first transaction.
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => router.push("/create")}>
                <Ionicons name="add-circle" size={20} color={COLORS.white} />
                <Text style={styles.emptyStateButtonText}>Add transaction</Text>
            </TouchableOpacity>
        </View>
    )
}