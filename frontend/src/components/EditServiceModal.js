import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateWeddingService } from "../redux/actions/action";
function EditServiceModal({ closeModal, serviceData }) {
  const dispatch = useDispatch();
  const [editedServiceData, setEditedServiceData] = useState(serviceData);

  useEffect(() => {
    setEditedServiceData(serviceData);
  }, [serviceData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedServiceData({
      ...editedServiceData,
      [name]: value,
    });
  };

  const handleEditService = () => {
    dispatch(updateWeddingService(editedServiceData));
    const servicesFromLocalStorage = JSON.parse(localStorage.getItem("weddingServices"));
    const updatedServices = servicesFromLocalStorage.map(service => {
      if (service.maSanh === editedServiceData.maSanh) {
        return editedServiceData; // Update the service with edited data
      } else {
        return service; // Return other Services as they are
      }
    });
    localStorage.setItem("weddingServices", JSON.stringify(updatedServices));
    closeModal();
  };

  return (
    <div>
      <h2>Chỉnh sửa thông tin dịch vụ </h2>
      <form>
        <label>Mã dịch vụ :</label>
        <input
          type="text"
          name="maDichVu"
          value={editedServiceData.maDichVu}
          onChange={handleInputChange}
          disabled // Disable editing of the Service ID
        />
        <label>Tên dịch vụ :</label>
        <input
          type="text"
          name="tenDichVu"
          value={editedServiceData.tenDichVu}
          onChange={handleInputChange}
        />
        <label>Loại dịch vụ :</label>
        <select
          name="loaiDichVu"
          value={editedServiceData.loaiDichVu}
          onChange={handleInputChange}
        >
          <option value="">Chọn loại dịch vụ </option>
          <option value="Trang trí ">Trang trí </option>
          <option value="Chụp ảnh ">Chụp ảnh </option>
          <option value="Quà tặng">Quà tặng</option>
          {/* Add other options as needed */}
        </select>
        <label>Đơn Giá:</label>
        <input
          type="number"
          name="donGia"
          value={editedServiceData.donGia}
          onChange={handleInputChange}
        />
        <label>Mô Tả:</label>
        <input
          type="text"
          name="description"
          value={editedServiceData.description}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleEditService}>
          Lưu
        </button>
        <button type="button" onClick={closeModal}>
          Hủy
        </button>
      </form>
    </div>
  );
}

export default EditServiceModal;
