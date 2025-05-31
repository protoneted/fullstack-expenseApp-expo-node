import { sql } from "../config/db.js";

export const getTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await sql`SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_at DESC`;
        return res.status(200).json(transactions)
    } catch (error) {
        console.log("fetch transactions api faild-----------", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

export const createTransactionRecord =  async (req, res) => {
    //title. amount , category, user_id
    try {
        const { title, amount, category, user_id } = req.body;
        if (!title || amount === undefined || !category || !user_id) {
            return res.status(400).json({ message: "all fields are required" })
        }

        const transaction = await sql`INSERT INTO transactions(title, amount, category, user_id)
    VALUES (${title}, ${amount}, ${category}, ${user_id})
    RETURNING * `;

        console.log(transaction);

        return res.status(201).json(transaction[0])

    } catch (error) {
        console.log("create transaction api faild-----------", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

export const deleteTransactionByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        if (isNaN(Number(id))) {
            return res.status(400).json({ message: "invalid transactin Id" })
        }
        const result = await sql`DELETE FROM transactions WHERE id=${id} RETURNING *`;
        if (result.length) {
            return res.status(200).json({ message: "transaction deleted successfully." })
        } else {
            return res.status(404).json({ message: "transaction not found" })
        }
    } catch (error) {
        console.log("transaction delete api faild-----------", error);
        return res.status(500).json({ message: "internal server error" });
    }
}

export const getTransactionSummaryByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const balanceResult = await sql`SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}`;
        const incomeResult = await sql`SELECT COALESCE(SUM(amount),0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;
        const expensesResult = await sql`SELECT COALESCE(SUM(amount),0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;
        return res.status(200).json({
            balance: balanceResult[0].balance,
            income: incomeResult[0].income,
            expenses: expensesResult[0].expense
        })

    } catch (error) {
        console.log("summary api faild-----------", error);
        return res.status(500).json({ message: "internal server error" });
    }
}