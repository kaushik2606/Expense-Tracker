import TransactionPage from "../components/TransactionPage";
import { useAuth } from "../context/AuthContext";

const Income = () => {
  const { token } = useAuth();
  return <TransactionPage type="income" token={token} />;
};

export default Income;
