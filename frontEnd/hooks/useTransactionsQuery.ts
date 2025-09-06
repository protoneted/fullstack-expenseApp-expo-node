import {useQuery} from "@tanstack/react-query";
import {Alert} from "react-native";
const API_URL = "http://192.168.1.3:5001/api"


const fetchTransactions = async (userId) => {
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/transactions/${userId}`)
        const data = await response.json();
        return data.reverse();
    } catch (error) {
        console.error("erro fetching transactions:", error);
        throw new Error(error.message);

    }
}

const fetchSummary = async (userId) => {
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("erro fetching transactions:", error);
        throw new Error(error.message);

    }
}

export const deleteTransaction = async ({tId, userId}) => {
    if (!userId) return;

    try {
        const response = await fetch(`${API_URL}/transaction/${tId}`, {method: 'DELETE'});
        if (!response.ok) throw new Error("Failed to delete transaction.");

        // Alert.alert("Success", "Transaction deleted Successfully.");
    } catch (error) {
        console.error("erro fetching transactions:", error);
        Alert.alert("Error", error?.message);
    } finally {

    }
}

export const createTransaction = async ({user_id, title, amount, category}) => {
    if (!user_id) return;

    try {
        const response = await fetch(`${API_URL}/transaction`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user_id,
                title,
                amount,
                category,
            })
        })
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create transaction")
        }
        return await response.json()
        // Alert.alert("Success", "Transaction created Successfully.");
    } catch (error) {
        console.error("erro fetching transactions:", error);
        Alert.alert("Error", error?.message);
    } finally {

    }
}


export const useTransactionQueryData = (userId) => {
    return useQuery({
        queryKey: ["transactions"],
        queryFn: () => fetchTransactions(userId),
        staleTime: 1000 * 5
    })
}

export const useSummaryQueryData = (userId) => {
    return useQuery({
        queryKey: ["summary"],
        queryFn: () => fetchSummary(userId),
        initialData: {
            balance: 0,
            income: 0,
            expenses: 0,
        },
        staleTime: 1000 * 5
    })
}