import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api, { authConfig, getErrorMessage } from "../services/api";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount || 0);

const isCurrentMonth = (dateValue) => {
  const date = new Date(dateValue);
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth()
  );
};

const Home = () => {
  const { token, user } = useAuth();
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      api.get("/income", authConfig(token)),
      api.get("/expense", authConfig(token)),
    ])
      .then(([incomeResponse, expenseResponse]) => {
        if (isMounted) {
          setIncome(incomeResponse.data.data);
          setExpenses(expenseResponse.data.data);
        }
      })
      .catch((requestError) => {
        if (isMounted) {
          setError(getErrorMessage(requestError, "Unable to load dashboard data."));
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const monthlyIncome = income
    .filter((record) => isCurrentMonth(record.date))
    .reduce((sum, record) => sum + Number(record.amount), 0);
  const monthlyExpenses = expenses
    .filter((record) => isCurrentMonth(record.date))
    .reduce((sum, record) => sum + Number(record.amount), 0);
  const lifetimeIncome = income.reduce((sum, record) => sum + Number(record.amount), 0);
  const lifetimeExpenses = expenses.reduce((sum, record) => sum + Number(record.amount), 0);

  const recentTransactions = useMemo(
    () =>
      [
        ...income.map((record) => ({
          ...record,
          description: record.source,
          type: "Income",
        })),
        ...expenses.map((record) => ({
          ...record,
          description: record.title,
          type: "Expense",
        })),
      ]
        .sort((first, second) => new Date(second.date) - new Date(first.date))
        .slice(0, 8),
    [income, expenses],
  );

  const categories = useMemo(() => {
    const totals = expenses.reduce((result, expense) => {
      result[expense.category] = (result[expense.category] || 0) + Number(expense.amount);
      return result;
    }, {});
    const highest = Math.max(...Object.values(totals), 0);
    return Object.entries(totals)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 5)
      .map(([name, amount]) => ({
        name,
        amount,
        share: highest ? (amount / highest) * 100 : 0,
      }));
  }, [expenses]);

  return (
    <section>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h1 className="h2 mb-1">Home</h1>
          <p className="text-body-secondary mb-0">
            Welcome{user?.name ? `, ${user.name}` : ""}. Here is your financial overview.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Link className="btn btn-outline-primary" to="/dashboard/income">Add income</Link>
          <Link className="btn btn-primary" to="/dashboard/expense">Add expense</Link>
        </div>
      </div>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      <div className="row g-3 mb-4">
        {[
          { label: "Total balance", amount: lifetimeIncome - lifetimeExpenses, note: "All recorded time" },
          { label: "Income this month", amount: monthlyIncome, note: "Current month" },
          { label: "Expenses this month", amount: monthlyExpenses, note: "Current month" },
          { label: "Total income", amount: lifetimeIncome, note: "All recorded time" },
        ].map((card) => (
          <div className="col-12 col-sm-6 col-xl-3" key={card.label}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <p className="text-body-secondary mb-2">{card.label}</p>
                <p className="h4 mb-2">{formatCurrency(card.amount)}</p>
                <p className="small text-body-secondary mb-0">{card.note}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="h5 mb-0">Recent transactions</h2>
                <div className="small text-body-secondary">
                  Monthly net: {formatCurrency(monthlyIncome - monthlyExpenses)}
                </div>
              </div>
              {loading ? (
                <p className="text-body-secondary mb-0">Loading transactions...</p>
              ) : recentTransactions.length === 0 ? (
                <div className="text-center py-5">
                  <p className="fw-semibold mb-1">No transactions yet</p>
                  <p className="text-body-secondary mb-3">Add your first income or expense to get started.</p>
                  <Link className="btn btn-primary" to="/dashboard/income">Add your first record</Link>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Description</th>
                        <th scope="col">Type</th>
                        <th scope="col" className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTransactions.map((record) => (
                        <tr key={`${record.type}-${record._id}`}>
                          <td>{new Date(record.date).toLocaleDateString()}</td>
                          <td>{record.description}</td>
                          <td>{record.type}</td>
                          <td className="text-end fw-semibold">{formatCurrency(record.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-1">Spending by category</h2>
              <p className="small text-body-secondary mb-4">Your highest expense categories</p>
              {loading ? (
                <p className="text-body-secondary mb-0">Loading categories...</p>
              ) : categories.length === 0 ? (
                <p className="text-body-secondary mb-0">Category totals will appear after you add expenses.</p>
              ) : (
                <div className="d-grid gap-3">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <div className="d-flex justify-content-between small mb-1">
                        <span>{category.name}</span>
                        <span className="fw-semibold">{formatCurrency(category.amount)}</span>
                      </div>
                      <div className="progress" role="progressbar" aria-label={category.name} aria-valuenow={Math.round(category.share)} aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar bg-primary" style={{ width: `${category.share}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Link className="btn btn-outline-secondary btn-sm mt-4" to="/dashboard/expense">View expenses</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
