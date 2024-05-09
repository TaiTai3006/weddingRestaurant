import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addWeddingService } from "../redux/actions/action";

function AddServiceModal({ closeModal }) {
  const dispatch = useDispatch();
  const [newServiceData, setNewServiceData] = useState({
    maDichVu: "",
    tenDichVu: "",
    donGia: 0,
    loaiDichVu: "",
    ghiChu: "",
    soluong: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewServiceData({
      ...newServiceData,
      [name]: value,
    });
  };

  const handleAddService = () => {
    dispatch(addWeddingService(newServiceData));

    const servicesFromLocalStorage =
      JSON.parse(localStorage.getItem("weddingServices")) || [];
    servicesFromLocalStorage.push(newServiceData);
    localStorage.setItem("weddingServices", JSON.stringify(servicesFromLocalStorage));
    setNewServiceData({
      maDichVu: "",
      tenDichVu: "",
      donGia: 0,
      loaiDichVu: "",
      ghiChu: "",
      soluong: 1,
    });
    closeModal();
  };

  return (
    <div>
      <h2>Thêm mới dịch vụ </h2>
      <form>
        <label>Mã dịch vụ :</label>
        <input
          type="text"
          name="maDichVu"
          value={newServiceData.maDichVu}
          onChange={handleInputChange}
        />
        <label>Tên dịch vụ :</label>
        <input
          type="text"
          name="tenDichVu"
          value={newServiceData.tenDichVu}
          onChange={handleInputChange}
        />
        <label>Đơn Giá:</label>
        <input
          type="number"
          name="donGia"
          value={newServiceData.donGia}
          onChange={handleInputChange}
        />
        <label>Loại dịch vụ :</label>
        <select
          name="loaiDichVu"
          value={newServiceData.loaiDichVu}
          onChange={handleInputChange}
        >
          <option value="">Chọn loại dịch vụ </option>
          <option value="Trang trí ">Trang trí </option>
          <option value="Chụp ảnh ">Chụp ảnh </option>
          <option value="Quà tặng">Quà tặng</option>
          {/* Add other options as needed */}
        </select>
        <label>Ghi Chú:</label>
        <input
          type="text"
          name="ghiChu"
          value={newServiceData.ghiChu}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleAddService}>
          Thêm
        </button>
        <button type="button" onClick={closeModal}>
          Hủy
        </button>
      </form>
    </div>
  );
}

export default AddServiceModal;
