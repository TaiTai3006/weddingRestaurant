import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateWeddingShift } from "../redux/actions/action";
import Modal from 'react-modal';

function EditShiftModal({ isOpen, closeModal, ShiftData }) {
  const dispatch = useDispatch();
  const [editedShiftData, setEditedShiftData] = useState(ShiftData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedShiftData({
      ...editedShiftData,
      [name]: value
    });
  };

  const handleSaveEdit = () => {
    dispatch(updateWeddingShift(editedShiftData));
    const shiftsFromLocalStorage = JSON.parse(localStorage.getItem("weddingShifts"));
    const updatedShifts = shiftsFromLocalStorage.map(shift => {
      if (shift.maCa === editedShiftData.maCa) {
        return editedShiftData; // Update the hall with edited data
      } else {
        return shift; // Return other halls as they are
      }
    });
    localStorage.setItem("weddingShifts", JSON.stringify(updatedShifts));
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
    >
      <h2>Chỉnh sửa thông tin sảnh</h2>
      <form>
        <label>Mã Ca:</label>
        <input
          type="text"
          name="maCa"
          value={editedShiftData.maCa}
          onChange={handleInputChange}
        />
        <label>Tên Ca:</label>
        <input
          type="text"
          name="tenCa"
          value={editedShiftData.tenCa}
          onChange={handleInputChange}
        />
        <label>Giờ Bắt Đầu:</label>
        <input
          type="time"
          name="gioBatDau"
          value={editedShiftData.gioBatDau}
          onChange={handleInputChange}
        />
        <label>Giờ Kết Thúc:</label>
        <input
          type="time"
          name="gioKetThuc"
          value={editedShiftData.gioKetThuc}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleSaveEdit}>
          Sửa
        </button>
        <button type="button" onClick={closeModal}>
          Hủy
        </button>
      </form>
    </Modal>
  );
}

export default EditShiftModal;
