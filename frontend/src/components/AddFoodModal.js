import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addWeddingFood } from "../redux/actions/action";
import { CiImageOn } from "react-icons/ci";

function AddFoodModal({ closeModal }) {
  const dispatch = useDispatch();
  const foodTypes = useSelector((state) => state.foodTypes);
 
  const [newFoodData, setNewFoodData] = useState({
    mamonan: "",
    tenmonan: "",
    dongia: 0,
    loaimonan: "",
    ghichu: "",
    img: null,
  });
  // xử lý img

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFoodData({
      ...newFoodData,
      [name]: value,
    });
  };
  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setNewFoodData({
      ...newFoodData,
      img: imageFile ? URL.createObjectURL(imageFile) : null,
    });
  };
  const handleAddFood = () => {
    dispatch(addWeddingFood(newFoodData));
    setNewFoodData({
      mamonan: "",
      tenmonan: "",
      dongia: 0,
      loaimonan: "",
      ghichu: "",
      img: null, // Reset image field
    });
    closeModal();
  };

  return (
    <div className="add-modal-container">
      <h2 className="text-header">Thêm mới món ăn</h2>
      <form className="add-form">
        <div className="img-form">
          <label htmlFor="photo-upload" className="custom-file-upload">
            <div className="img-wrap img-upload">
              {newFoodData.img ? (
                <img src={newFoodData.img} alt="Preview" />
              ) : (
                <span className="img-icon">
                  <CiImageOn />
                </span>
              )}
              <input
                className="img-input"
                id="photo-upload"
                type="file"
                onChange={handleImageChange}
              />
            </div>
          </label>
        </div>
        <div className="text-form">
          <label className="label-input">Mã Món Ăn:</label>
          <input
            type="text"
            name="mamonan"
            value={newFoodData.mamonan}
            onChange={handleInputChange}
          />
          <label className="label-input">Tên Món Ăn:</label>
          <input
            type="text"
            name="tenmonan"
            value={newFoodData.tenmonan}
            onChange={handleInputChange}
          />
          <label className="label-input">Đơn Giá:</label>
          <input
            type="number"
            name="dongia"
            value={newFoodData.dongia}
            onChange={handleInputChange}
          />
          <label className="label-input">Loại Món Ăn:</label>

          <select
            name="loaimonan"
            value={newFoodData.loaimonan}
            onChange={handleInputChange}
          >
            {foodTypes.map((type) => (
              <option key={type.maloaimonan} value={type.maloaimonan}>
                {type.tenloaimonan}
              </option>
            ))}
          </select>
          <label className="label-input">Ghi Chú:</label>
          <input
            type="text"
            name="ghichu"
            value={newFoodData.ghichu}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <div className="btn-group">
      <button  className="update-btn" type="button" onClick={handleAddFood}>
        Lưu
      </button>
      <button className="delete-btn" type="button" onClick={closeModal}>
        Hủy
      </button>
      </div>
     
    </div>
  );
}

export default AddFoodModal;
