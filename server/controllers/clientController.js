import Client from "../models/Client.js";
import Transaction from "../models/Transaction.js";
import crypto from "crypto";

const buildClientSummary = (client, transactions = []) => {
  const totalCredit = transactions
    .filter((t) => t.type === "Credit")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalDebit = transactions
    .filter((t) => t.type === "Debit")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const currentBalance = totalCredit - totalDebit;

  return {
    totalCredit,
    totalDebit,
    currentBalance,
    lastTransactionDate:
      transactions.length > 0
        ? new Date(
            transactions.reduce((latest, tx) => {
              const date = new Date(tx.transactionDate || tx.createdAt);
              return date > latest ? date : latest;
            }, new Date(0)),
          )
        : null,
  };
};

export const createClient = async (req, res, next) => {
  try {
    const { name, mobile } = req.body;

    const normalizedName = name?.trim();
    const normalizedMobile = mobile?.trim();

    if (!normalizedName || !normalizedMobile) {
      return res
        .status(400)
        .json({ message: "Client name and mobile number are required" });
    }

    const existing = await Client.findOne({
      userId: req.user._id,
      mobile: normalizedMobile,
    });
    if (existing) {
      return res
        .status(400)
        .json({ message: "A client with this mobile number already exists" });
    }

    const client = await Client.create({
      userId: req.user._id,
      clientId: `CL-${crypto.randomBytes(4).toString("hex").toUpperCase()}`,
      name: normalizedName,
      mobile: normalizedMobile,
      totalCredit: 0,
      totalDebit: 0,
      currentBalance: 0,
    });

    res.status(201).json(client);
  } catch (error) {
    next(error);
  }
};

export const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ userId: req.user._id }).sort({
      updatedAt: -1,
    });

    const clientIds = clients.map((client) => client._id);
    const transactions = await Transaction.find({
      userId: req.user._id,
      clientId: { $in: clientIds },
    }).sort({ transactionDate: -1 });

    const enriched = clients.map((client) => {
      const clientTransactions = transactions.filter(
        (tx) => tx.clientId.toString() === client._id.toString(),
      );
      const summary = buildClientSummary(client, clientTransactions);
      return {
        ...client.toObject(),
        ...summary,
      };
    });

    res.json(enriched);
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const transactions = await Transaction.find({
      clientId: client._id,
      userId: req.user._id,
    }).sort({ transactionDate: -1, createdAt: -1 });
    const summary = buildClientSummary(client, transactions);

    res.json({
      ...client.toObject(),
      ...summary,
      transactions,
    });
  } catch (error) {
    next(error);
  }
};

export const searchClients = async (req, res, next) => {
  try {
    const { q = "", filter = "all" } = req.query;
    const search = q.trim();

    const query = { userId: req.user._id };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
      ];
    }

    if (filter === "credit") {
      query.currentBalance = { $gt: 0 };
    } else if (filter === "debit") {
      query.currentBalance = { $lt: 0 };
    } else if (filter === "settled") {
      query.currentBalance = 0;
    }

    const clients = await Client.find(query).sort({ updatedAt: -1 });
    res.json(clients);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { name, mobile } = req.body;
    if (name) client.name = name.trim();
    if (mobile) client.mobile = mobile.trim();

    await client.save();
    res.json(client);
  } catch (error) {
    next(error);
  }
};

export const deleteClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    await Transaction.deleteMany({
      clientId: client._id,
      userId: req.user._id,
    });
    await client.deleteOne();

    res.json({
      message: "Client and related transactions deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
