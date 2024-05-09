import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateWeddingFood } from "../redux/actions/action";
import { CiImageOn } from "react-icons/ci";

function EditFoodModal({ closeModal, foodData }) {
  const dispatch = useDispatch();
  const foodTypes = useSelector((state) => state.foodTypes);
  const [editedFoodData, setEditedFoodData] = useState(foodData);
  const [image, setImage] = useState(null);

  useEffect(() => {
    setEditedFoodData(foodData);
  }, [foodData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedFoodData({
      ...editedFoodData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setEditedFoodData({
      ...editedFoodData,
      img: imageFile ? URL.createObjectURL(imageFile) : null,
    });
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImage(null);
    }
  };

  const handleEditFood = () => {
    console.log(editedFoodData)
    dispatch(updateWeddingFood(editedFoodData));
    closeModal();
  };

  return (
    <div className="add-modal-container">
      <h2 className="text-header">Chỉnh sửa thông tin món ăn</h2>
      <form className="add-form">
        <div className="img-form">
          <label htmlFor="photo-upload" className="custom-file-upload">
            <div className="img-wrap img-upload">
              {image ? (
                <img src={image} alt="Preview" />
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
            value={editedFoodData.mamonan}
            onChange={handleInputChange}
            disabled
          />
          <label className="label-input">Tên Món Ăn:</label>
          <input
            type="text"
            name="tenmonan"
            value={editedFoodData.tenmonan}
            onChange={handleInputChange}
          />
          <label className="label-input">Đơn Giá:</label>
          <input
            type="number"
            name="dongia"
            value={editedFoodData.dongia}
            onChange={handleInputChange}
          />
          <label className="label-input">Loại Món Ăn:</label>
          <select
            name="loaimonan"
            value={editedFoodData.loaimonan}
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
            value={editedFoodData.ghichu}
            onChange={handleInputChange}
          />
        </div>
      </form>
      <div className="btn-group">
        <button className="update-btn" type="button" onClick={handleEditFood}>
          Lưu
        </button>
        <button className="delete-btn" type="button" onClick={closeModal}>
          Hủy
        </button>
      </div>
    </div>
  );
}

export default EditFoodModal;
