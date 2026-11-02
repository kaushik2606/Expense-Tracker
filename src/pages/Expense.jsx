import TransactionPage from "../components/TransactionPage";
import { useAuth } from "../context/AuthContext";

const Expense = () => {
  const { token } = useAuth();
  return <TransactionPage type="expense" token={token} />;
};

export default Expense;
