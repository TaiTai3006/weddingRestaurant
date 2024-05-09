import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormErrors, updateFormData } from "../redux/actions/action";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { formatCurrency } from "../utils";

import img from "../images/myudon.jpg";

const FoodInfoTab = ({
  selectedFoodType,
  foodTypes,
  weddingFoods,
  checkedFoods,
  setCheckedFoods,
  handleFoodCheckboxChange,
  setSelectedFoodType,
  handleTabChange,
  formErrorsWedding,
  selectedTabIndex,
}) => {
  const dispatch = useDispatch();

  const formErrors = useSelector((state) => state.formErrors);
  const errors =
    formErrors.formErrors.foods && formErrorsWedding.foods
      ? `${formErrors.formErrors.foods}`
      : formErrors.formErrors.foods || formErrorsWedding.foods;
  const handleCardClick = (mamonan) => {
    const isChecked = checkedFoods.includes(mamonan);
    const updatedCheckedFoods = isChecked
      ? checkedFoods.filter((id) => id !== mamonan)
      : [...checkedFoods, mamonan];
    setCheckedFoods(updatedCheckedFoods);
  };

  useEffect(() => {
    // Lấy dữ liệu từ local storage nếu có
    const storedCheckedFoods = JSON.parse(localStorage.getItem("checkedFoods"));
    if (storedCheckedFoods) {
      setCheckedFoods(storedCheckedFoods);
    }
  }, []);

  useEffect(() => {
    // Lưu checkedFoods vào local storage mỗi khi nó thay đổi
    localStorage.setItem("checkedFoods", JSON.stringify(checkedFoods));
  }, [checkedFoods]);
  const validateForm = () => {
    const errors = {};
    if (checkedFoods.length === 0) {
      errors.foods = "Vui lòng chọn ít nhất một món ăn";
    }
    dispatch(updateFormErrors(errors));
    return Object.keys(errors).length === 0;
  };

  const goToPreviousTab = () => {
    handleTabChange(null, selectedTabIndex - 1);
  };

  const goToNextTab = () => {
    if (validateForm()) {
      handleTabChange(null, selectedTabIndex + 1);
    }
  };

  return (
    <div className="foods-container">
      <div className="tab-header">
        <div className="btn-group">
          <button className="navigate-btn " onClick={goToPreviousTab}>
            {" "}
            <GrFormPrevious />
          </button>
          <button className="navigate-btn " onClick={goToNextTab}>
            <MdNavigateNext />
          </button>
        </div>

        <select className="foodtype-select" 
          value={selectedFoodType}
          onChange={(e) => setSelectedFoodType(e.target.value)}
        >
          <option value="">Chọn loại món ăn</option>
          {foodTypes.map((type) => (
            <option key={type.maloaimonan} value={type.maloaimonan}>
              {type.tenloaimonan}
            </option>
          ))}
        </select>
      </div>

      <div className="card-container">
        {selectedFoodType === ""
          ? weddingFoods.map((food, index) => (
              <div
                key={index}
                className={`card ${
                  checkedFoods.includes(food.mamonan) ? "checked" : ""
                }`}
                onClick={() => handleCardClick(food.mamonan)}
              >
                <img src={img} alt="" className="card-image" />
                <div className="card-info">
                  <div className="card-header">{food.tenmonan}</div>
                  <div className="card-body">
                    <p> {formatCurrency(parseFloat(food.dongia))}</p>
                    <input
                      type="checkbox"
                      name="danhsachmonan"
                      value={food.mamonan}
                      style={{ display: "none" }}
                      checked={checkedFoods.includes(food.mamonan)}
                      onChange={handleFoodCheckboxChange}
                    />
                  </div>
                </div>
              </div>
            ))
          : weddingFoods
              .filter((food) => food.maloaimonan === selectedFoodType)
              .map((food, index) => (
                <div
                  key={index}
                  className={`card ${
                    checkedFoods.includes(food.mamonan) ? "checked" : ""
                  }`}
                  onClick={() => handleCardClick(food.mamonan)}
                >
                  <img src={img} alt="" className="card-image" />
                  <div className="card-info">
                    <div className="card-header">{food.tenmonan}</div>
                    <div className="card-body">
                      <p>{formatCurrency(food.dongia)}</p>
                      <input
                        type="checkbox"
                        name="danhsachmonan"
                        value={food.mamonan}
                        style={{ display: "none" }}
                        checked={checkedFoods.includes(food.mamonan)}
                        onChange={handleFoodCheckboxChange}
                      />
                    </div>
                  </div>
                </div>
              ))}
      </div>

      {errors && (
        <span style={{ color: "red", fontStyle: "italic", fontSize: 13 }}>
          {errors}
        </span>
      )}
    </div>
  );
};

export default FoodInfoTab;
