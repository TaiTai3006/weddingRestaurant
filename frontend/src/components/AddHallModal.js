import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWeddingHall } from "../redux/actions/action";

function AddHallModal({ closeModal }) {
  const dispatch = useDispatch();
  const [newHallData, setNewHallData] = useState({
    maSanh: "",
    tenSanh: "",
    loaiSanh: "",
    soLuongBanToiThieu: "",
    ghiChu: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHallData({
      ...newHallData,
      [name]: value,
    });
  };

  const handleAddHall = () => {
    dispatch(addWeddingHall(newHallData));
    const hallsFromLocalStorage =
      JSON.parse(localStorage.getItem("weddingHalls")) || [];
    hallsFromLocalStorage.push(newHallData);
    localStorage.setItem("weddingHalls", JSON.stringify(hallsFromLocalStorage));
    setNewHallData({
      maSanh: "",
      tenSanh: "",
      loaiSanh: "",
      soLuongBanToiThieu: "",
      ghiChu: "",
    });
    closeModal();
  };
  return (
    <div>
      <h2>Thêm mới sảnh</h2>
      <form>
        <label>Mã Sảnh:</label>
        <input
          type="text"
          name="maSanh"
          value={newHallData.maSanh}
          onChange={handleInputChange}
        />
        <label>Tên Sảnh:</label>
        <input
          type="text"
          name="tenSanh"
          value={newHallData.tenSanh}
          onChange={handleInputChange}
        />
        <label>Loại Sảnh:</label>
        <select
          name="loaiSanh"
          value={newHallData.loaiSanh}
          onChange={handleInputChange}
        >
          <option value="">Chọn loại sảnh</option>
          <option value="Hiện đại">Hiện đại</option>
          <option value="Hoang sơ">Hoang sơ</option>
          <option value="Cổ điển">Cổ điển</option>
          <option value="Công nghệ">Công nghệ</option>
          <option value="Bóng tối">Bóng tối</option>
        </select>
        <label>Số Lượng Bàn Tối Thiểu:</label>
        <input
          type="number"
          name="soLuongBanToiThieu"
          value={newHallData.soLuongBanToiThieu}
          onChange={handleInputChange}
        />
        <label>Ghi Chú:</label>
        <input
          type="text"
          name="ghiChu"
          value={newHallData.ghiChu}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleAddHall}>
          Thêm
        </button>
        <button type="button" onClick={closeModal}>
          Hủy
        </button>
      </form>
    </div>
  );
}

export default AddHallModal;
