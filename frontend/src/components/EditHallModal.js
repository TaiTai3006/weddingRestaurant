import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateWeddingHall } from "../redux/actions/action";
import Modal from 'react-modal';

function EditModal({ isOpen, closeModal, hallData }) {
  const dispatch = useDispatch();
  const [editedHallData, setEditedHallData] = useState(hallData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedHallData({
      ...editedHallData,
      [name]: value
    });
  };

  const handleSaveEdit = () => {
    dispatch(updateWeddingHall(editedHallData));
    const hallsFromLocalStorage = JSON.parse(localStorage.getItem("weddingHalls"));
    const updatedHalls = hallsFromLocalStorage.map(hall => {
      if (hall.maSanh === editedHallData.maSanh) {
        return editedHallData; // Update the hall with edited data
      } else {
        return hall; // Return other halls as they are
      }
    });
    localStorage.setItem("weddingHalls", JSON.stringify(updatedHalls));
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
        <label>Mã Sảnh:</label>
        <input type="text" name="maSanh" value={editedHallData.maSanh} onChange={handleInputChange} disabled />
        <label>Tên Sảnh:</label>
        <input type="text" name="tenSanh" value={editedHallData.tenSanh} onChange={handleInputChange} />
        <label>Loại Sảnh:</label>
        <select name="loaiSanh" value={editedHallData.loaiSanh} onChange={handleInputChange}>
        
        <option value="Hiện đại">Hiện đại</option>
        <option value="Hoang sơ">Hoang sơ</option>
        <option value="Cổ điển">Cổ điển</option>
        <option value="Công nghệ">Công nghệ</option>
        <option value="Bóng tối">Bóng tối</option>
      </select>
        <label>Số Lượng Bàn Tối Thiểu:</label>
        <input type="number" name="soLuongBanToiThieu" value={editedHallData.soLuongBanToiThieu} onChange={handleInputChange} />
        <label>Ghi Chú:</label>
        <input type="text" name="ghiChu" value={editedHallData.ghiChu} onChange={handleInputChange} />
        <button type="button" onClick={handleSaveEdit}>Lưu</button>
        <button type="button" onClick={closeModal}>Hủy</button>
      </form>
    </Modal>
  );
}

export default EditModal;
