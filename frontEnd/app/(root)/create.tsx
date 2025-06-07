import {styles} from "@/assets/styles/create.styles";
import {COLORS} from "@/constants/colors";
import {API_URL} from "@/hooks/useTransactions";
import {useUser} from "@clerk/clerk-expo"
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {useState} from "react";
import {ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View} from "react-native"


const expenseCategory = [
    {id: "Food", name: "Food & Drinks", icon: "fast-food"},
    {id: "Shopping", name: "Shopping", icon: "cart"},
    {id: "Transportation", name: "Transportation", icon: "car"},
    {id: "Exntertainment", name: "Exntertainment", icon: "film"},
    {id: "Bills", name: "Bills", icon: "receipt"},
    {id: "income", name: "income", icon: "cash"},
    {id: "other", name: "other", icon: "ellipsis-horizontal"}
]
const incomeCategory = [
    {id: "salary", name: "Salary", icon: "cash"},
    {id: "fromFriend", name: "From Friend", icon: "people-circle-sharp"},
    {id: "business", name: "Business", icon: "business-sharp"},
    {id: "other", name: "Other", icon: "ellipsis-horizontal"},
]


const CreatedTransaction = () => {
    const {user} = useUser();    
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [isExpense, setIsExpense] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const catogeryMap = isExpense ? expenseCategory : incomeCategory;
    const handleCreate = async () => {
        if (!title.trim()) {
            return Alert.alert("Error", "please enter transcation title.")
        };
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            return Alert.alert("Error", "please enter valid amount.")
        }
        if (!category) {
            return Alert.alert("Error", "please select a category.")
        }
        setIsLoading(true)
        try {
            const formattedAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));
            const response = await fetch(`${API_URL}/transaction`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: user.id,
                    title,
                    amount: formattedAmount,
                    category,
                })
            })
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create transaction")
            }

            Alert.alert("Success", "Transaction created successfully.");
            router.back();

        } catch (error) {
            Alert.alert("Error", error.message || "Failed to create transaction.");
            console.log("Error creating transaction", error);


        } finally {
            setIsLoading(false)

        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Ionicons name=""/>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Transaction</Text>
                <TouchableOpacity style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
                    onPress={handleCreate}
                    disabled={isLoading}
                >
                    <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
                    {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary} />}
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                <View style={styles.typeSelector}>
                    <TouchableOpacity style={[styles.typeButton, isExpense && styles.typeButtonActive]} onPress={()=>setIsExpense(true)}>
                        <Ionicons name="arrow-down-circle" size={22} color={isExpense ? COLORS.white : COLORS.expense} style={styles.typeIcon} />
                        <Text style={[styles.typeButtonText, isExpense && styles.typeButtonTextActive]}>Expenses</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.typeButton, !isExpense && styles.typeButtonActive]} onPress={()=>setIsExpense(false)}>
                        <Ionicons name="arrow-up-circle" size={22} color={!isExpense ? COLORS.white : COLORS.income} style={styles.typeIcon} />
                        <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>Income</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>₹</Text>
                    <TextInput
                        style={styles.amountInput}
                        placeholder="0.00"
                        placeholderTextColor={COLORS.textLight}
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="number-pad"
                        maxLength={20}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Ionicons
                        name="create-outline"
                        size={22}
                        color={COLORS.textLight}
                        style={styles.inputIcon}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        placeholderTextColor={COLORS.textLight}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>
                <Text style={styles.sectionTitle}>
                    Category
                </Text>
                                    <Ionicons name="pricetag-outline" size={16} color={COLORS.text} />

                <View style={styles.categoryGrid}>
                    {catogeryMap.map((e) => (
                        <TouchableOpacity
                            key={e.id}
                            style={[styles.categoryButton, category === e.name && styles.categoryButtonActive]}
                            onPress={() => setCategory(e.name)}
                        >
                            <Ionicons
                                name={e.icon}
                                size={20}
                                color={category === e.name ? COLORS.white : COLORS.text}
                                style={styles.categoryIcon}
                            />
                            <Text style={[styles.categoryButtonText, category === e.name && styles.categoryButtonTextActive]}>
                                {e.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'large'} color={COLORS.primary}/>
                </View>
            )}
        </View>
    )
}

export default CreatedTransaction;