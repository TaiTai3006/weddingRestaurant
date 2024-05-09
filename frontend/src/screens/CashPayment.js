import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {  addInvoice } from "../redux/actions/action";
import { Link, useNavigate } from "react-router-dom";


function CashPayment() {
  const formData = useSelector((state) => state.formData);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [amountReceived, setAmountReceived] = useState(0);
  const [quickAmounts] = useState([
    50000, 100000, 200000, 500000, 1000000, 2000000, 500000, 10000000,
  ]);
  const [errorMessage, setErrorMessage] = useState("");
  const [remainingAmount, setRemainingAmount] = useState(0);
  useEffect(() => {
    const remain = amountReceived - formData.tiencoc;

    setRemainingAmount(remain);
  }, [amountReceived]);
  const handleChangeAmountReceived = (e) => {
    setAmountReceived(e.target.value);
  };

  const handleQuickAmountClick = (amount) => {
    setAmountReceived(amount.toString());
  };

  const handlePaymentSubmit = () => {
    dispatch(addInvoice(formData));

    const invoicesFromLocalStorage =
      JSON.parse(localStorage.getItem("invoices")) || [];
    invoicesFromLocalStorage.push(formData);
    localStorage.setItem("invoices", JSON.stringify(invoicesFromLocalStorage));
    navigate("/management");
  };

  const handleClearAmount = () => {
    setAmountReceived("");
  };

  return (
    <div className="payment-container">
      <h2>Thanh toán bằng tiền mặt</h2>
      <div className="form-row">
        <label htmlFor="totalAmount">Số tiền cọc :</label>
        <span id="totalAmount">{formData.tiencoc}</span>
      </div>
      <div className="amountReceived form-row">
        <label htmlFor="amountReceived">Số tiền đã nhận:</label>
        <input
          type="number"
          id="amountReceived"
          value={amountReceived}
          onChange={handleChangeAmountReceived}
          placeholder="Nhập số tiền đã nhận"
        />
      </div >
      {amountReceived > formData.tiencoc ? (
        <div className="form-row">
          <label htmlFor="remainingAmount">Tiền còn lại phải trả :</label>
          <span id="remainingAmount">{remainingAmount}</span>
        </div>
      ) : (
        errorMessage && <span id="remainingAmount">Chưa đủ tiền cọc </span>
      )}

      <div>
        <div className="quick-amount">
          {quickAmounts.map((amount, index) => (
            <button key={index} onClick={() => handleQuickAmountClick(amount)}>
              {amount}
            </button>
          ))}
          <button onClick={handleClearAmount}>Xóa</button>
        </div>
        <button onClick={handlePaymentSubmit}>Xác nhận thanh toán</button>
      </div>
    </div>
  );
}

export default CashPayment;
