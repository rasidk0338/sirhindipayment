import crypto from "crypto";
import Client from "../models/Client.js";
import Transaction from "../models/Transaction.js";

const recalculateClientMetrics = async (clientId, userId) => {
  const transactions = await Transaction.find({ clientId, userId }).sort({
    transactionDate: 1,
    createdAt: 1,
  });

  let totalCredit = 0;
  let totalDebit = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "Credit")
      totalCredit += Number(transaction.amount || 0);
    if (transaction.type === "Debit")
      totalDebit += Number(transaction.amount || 0);
  });

  const currentBalance = totalCredit - totalDebit;
  const lastTransactionDate =
    transactions.length > 0
      ? transactions[transactions.length - 1].transactionDate
      : null;

  await Client.findByIdAndUpdate(clientId, {
    totalCredit,
    totalDebit,
    currentBalance,
    lastTransactionDate,
    updatedAt: new Date(),
  });
};

export const addTransaction = async (req, res, next) => {
  try {
    const { clientName, mobile, description, type, amount, transactionDate } =
      req.body;

    if (!clientName || !mobile || !description || !type || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["Credit", "Debit"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Transaction type must be Credit or Debit" });
    }

    const client = await Client.findOne({
      userId: req.user._id,
      mobile: mobile.trim(),
    });

    let clientRecord;
    if (!client) {
      clientRecord = await Client.create({
        userId: req.user._id,
        clientId: `CL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
        name: clientName.trim(),
        mobile: mobile.trim(),
        totalCredit: 0,
        totalDebit: 0,
        currentBalance: 0,
      });
    } else {
      clientRecord = client;
    }

    const transaction = await Transaction.create({
      userId: req.user._id,
      clientId: clientRecord._id,
      transactionId: `TX-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      amount: Number(amount),
      type,
      description: description.trim(),
      transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
    });

    await recalculateClientMetrics(clientRecord._id, req.user._id);

    res.status(201).json({ transaction, client: clientRecord });
  } catch (error) {
    next(error);
  }
};

export const getClientTransactions = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.clientId,
      userId: req.user._id,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const transactions = await Transaction.find({
      clientId: client._id,
      userId: req.user._id,
    }).sort({ transactionDate: -1, createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const { amount, description, type, transactionDate, clientName, mobile } =
      req.body;
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const client = await Client.findOne({
      _id: transaction.clientId,
      userId: req.user._id,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    if (amount !== undefined) transaction.amount = Number(amount);
    if (description) transaction.description = description.trim();
    if (type && ["Credit", "Debit"].includes(type)) transaction.type = type;
    if (transactionDate)
      transaction.transactionDate = new Date(transactionDate);

    if (clientName) client.name = clientName.trim();
    if (mobile) client.mobile = mobile.trim();

    await client.save();
    await transaction.save();
    await recalculateClientMetrics(client._id, req.user._id);

    res.json({ transaction, client });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const clientId = transaction.clientId;
    await Transaction.deleteOne({ _id: req.params.id, userId: req.user._id });
    await recalculateClientMetrics(clientId, req.user._id);

    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ transactionDate: -1, createdAt: -1 })
      .populate("clientId");
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
