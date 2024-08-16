import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from "react-router-dom";

import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { SendMoney } from "./pages/SendMoney";
import { Me } from "./pages/Me";
import { TransactionStatus } from "./pages/TransactionStatus";
import { Transactions } from "./pages/Transactions";
import { Logout } from "./components/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} 
        />
        <Route path="/send" element={<ProtectedRoute> <SendMoney /> </ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute> <Transactions /> </ProtectedRoute>} />
        <Route path="/transaction-status" element={<TransactionStatus />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<Me />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
