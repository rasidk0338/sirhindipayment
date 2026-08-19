import Client from "../models/Client.js";
import Transaction from "../models/Transaction.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const [clientCount, transactions, aggregates] = await Promise.all([
      Client.countDocuments({ userId: req.user._id }),
      Transaction.find({ userId: req.user._id }).sort({
        transactionDate: -1,
        createdAt: -1,
      }),
      Client.aggregate([
        { $match: { userId: req.user._id } },
        {
          $group: {
            _id: null,
            totalCredit: { $sum: "$totalCredit" },
            totalDebit: { $sum: "$totalDebit" },
            netBalance: { $sum: "$currentBalance" },
          },
        },
      ]),
    ]);

    const summary = aggregates[0] || {
      totalCredit: 0,
      totalDebit: 0,
      netBalance: 0,
    };

    res.json({
      totalClients: clientCount,
      totalCredit: summary.totalCredit,
      totalDebit: summary.totalDebit,
      netBalance: summary.netBalance,
      transactionsCount: transactions.length,
      recentTransactions: transactions.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};
