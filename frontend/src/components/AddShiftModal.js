import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addWeddingShift } from "../redux/actions/action";

function AddShiftModal({ closeModal }) {
  const dispatch = useDispatch();
  const [newShiftData, setNewShiftData] = useState({
    maCa: "",
    tenCa: "",
    gioBatDau: "",
    gioKetThuc: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewShiftData({
      ...newShiftData,
      [name]: value,
    });
  };

  const handleAddShift = () => {
    dispatch(addWeddingShift(newShiftData));

    const shiftsFromLocalStorage = JSON.parse(localStorage.getItem("weddingShifts")) || [];
    shiftsFromLocalStorage.push(newShiftData);
    localStorage.setItem("weddingShifts", JSON.stringify(shiftsFromLocalStorage));
    setNewShiftData({
      maCa: "",
      tenCa: "",
      gioBatDau: "",
      gioKetThuc: "",
    });
    closeModal();
  };

  return (
    <div>
      <h2>Thêm mới ca</h2>
      <form>
        <label>Mã Ca:</label>
        <input
          type="text"
          name="maCa"
          value={newShiftData.maCa}
          onChange={handleInputChange}
        />
        <label>Tên Ca:</label>
        <input
          type="text"
          name="tenCa"
          value={newShiftData.tenCa}
          onChange={handleInputChange}
        />
        <label>Giờ Bắt Đầu:</label>
        <input
          type="time"
          name="gioBatDau"
          value={newShiftData.gioBatDau}
          onChange={handleInputChange}
        />
        <label>Giờ Kết Thúc:</label>
        <input
          type="time"
          name="gioKetThuc"
          value={newShiftData.gioKetThuc}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleAddShift}>
          Thêm
        </button>
        <button type="button" onClick={closeModal}>
          Hủy
        </button>
      </form>
    </div>
  );
}

export default AddShiftModal;
