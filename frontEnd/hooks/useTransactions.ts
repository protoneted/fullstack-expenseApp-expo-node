import {useCallback, useState} from "react"
import {Alert} from "react-native";
export const API_URL = "http://192.168.1.3:5001/api"
export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0,
    });
    const [loading, setLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json();
            setTransactions(data.reverse());
        } catch (error) {
            console.error("erro fetching transactions:", error);

        } finally {
            setLoading(false)

        }
    }, [userId])

    const fetchSummary = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("erro fetching transactions:", error);

        } finally {
            setLoading(false)

        }
    }, [userId])

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true)
        try {
            await Promise.all([fetchTransactions(),fetchSummary()])
        } catch (error) {
            console.error("erro fetching transactions:", error);

        } finally {
            setLoading(false)

        }
    }, [userId, fetchTransactions, fetchSummary])

        const deleteTransaction = useCallback(async (tId) => {
        if (!userId) return;
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/transaction/${tId}`,{method:'DELETE'});
            if (!response.ok) throw new Error("Failed to delete transaction.");

            //refresh data after delete.
            loadData();
        Alert.alert("Success","Transaction deleted Successfully.");
        } catch (error) {
            console.error("erro fetching transactions:", error);
        Alert.alert("Error",error?.message);
        } finally {
            setLoading(false)
        }
    }, [userId])

    return {loadData, deleteTransaction, transactions, summary, loading}
}