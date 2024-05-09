import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./screens/Dashboard";
import Booking from "./screens/Booking";
import Managent from "./screens/Managent";
import OrderConfirm from "./screens/OrderConfirm";
import CashPayment from "./screens/CashPayment";
import BankPayment from "./screens/BankPayment";
import ReportReview from "./screens/ReportReview";
import CategoryList from "./screens/CategoryList";
import WeddingHalls from "./screens/WeddingHalls";
import WeddingFoods from "./screens/WeddingFoods";
import WeddingServices from "./screens/WeddingServices";
import WeddingShifts from "./screens/WeddingShifts";

import "./style/reset.css";

function App() {
  return (
    <Router>
      <div className="container">
        <Header />
        <div className="content">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/management" element={<Managent />} />
            <Route path="/orderconfirm" element={<OrderConfirm />} />
            <Route path="/cashpayment" element={<CashPayment />} />
            <Route path="/bankpayment" element={<BankPayment />} />
            <Route path="/categorylist" element={<CategoryList/>} />
            <Route path="/weddinghalls" element={<WeddingHalls/>} />
            <Route path="/weddingfoods" element={<WeddingFoods/>} />
            <Route path="/weddingservices" element={<WeddingServices/>} />
            <Route path="/weddingshifts" element={<WeddingShifts/>} />
          </Routes>
        </div>
      </div>
      <Routes>
        <Route path="/report-review" element={<ReportReview />} />
      </Routes>
    </Router>
  );
}

export default App;
