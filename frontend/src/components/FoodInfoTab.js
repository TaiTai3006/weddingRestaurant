import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormErrors, updateFormData } from "../redux/actions/action";
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { formatCurrency } from "../utils";

import img from "../images/myudon.jpg";
import {
  fetchFoodTypes,
  fetchWeddingFoods,
} from "../redux/actions/actionCreators";

const FoodInfoTab = ({
  handleTabChange,
  formErrorsWedding,
  selectedTabIndex,
  location,
  wedding,
  setWedding,
}) => {
  const dispatch = useDispatch();

  const [selectedFoodType, setSelectedFoodType] = useState("");
  const foodTypes = useSelector((state) => state.foodTypes);
  const weddingFoods = useSelector((state) => state.weddingFoods);

  useEffect(() => {
    // dispatch(fetchWeddingFoods());
    dispatch(fetchFoodTypes());
  }, [location]);

  const foodList = wedding?.danhsachmonan ? wedding?.danhsachmonan : [];

  const checkFoodList = (mamonan) => {
    return foodList.find((food) => food?.mamonan === mamonan) ? true : false;
  };

  const handleCardClick = (food) => {
    if (!checkFoodList(food.mamonan)) {
      wedding = {
        ...wedding,
        danhsachmonan: [
          ...wedding.danhsachmonan,
          {
            mamonan: food.mamonan,
            dongiamonan: food.dongia,
            soluong: 1,
            ghichu: "",
          },
        ],
      };

      setWedding(wedding);
      localStorage.setItem("formWedding", JSON.stringify(wedding));
    } else {
      const foodList = wedding.danhsachmonan;
      const newFoodList = foodList.filter((f) => f.mamonan !== food.mamonan);
      wedding = { ...wedding, danhsachmonan: newFoodList };

      setWedding(wedding);
      localStorage.setItem("formWedding", JSON.stringify(wedding));
    }
  };

  const formErrors = useSelector((state) => state.formErrors);
  const errors =
    formErrors.formErrors.foods && formErrorsWedding.foods
      ? `${formErrors.formErrors.foods}`
      : formErrors.formErrors.foods || formErrorsWedding.foods;

  const validateForm = () => {
    const errors = {};
    if (foodList.length === 0) {
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

        <select
          className="foodtype-select"
          value={selectedFoodType}
          onChange={(e) => setSelectedFoodType(e.target.value)}
        >
          <option value="">Chọn loại món ăn</option>
          {foodTypes.map((type, index) => (
            <option key={index} value={type.maloaimonan}>
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
                  checkFoodList(food.mamonan) ? "checked" : ""
                }`}
                onClick={() => handleCardClick(food)}
              >
                <img src={img} alt="" className="card-image" />
                <div className="card-info">
                  <div className="card-header">{food.tenmonan}</div>
                  <div className="card-body">
                    <p> {formatCurrency(parseFloat(food.dongia))}</p>
                    {/* <input
                      type="checkbox"
                      name="danhsachmonan"
                      value={food.mamonan}
                      style={{ display: "none" }}
                      checked={checkFoodList(food.mamonan)}
                      onChange={handleFoodCheckboxChange}
                    /> */}
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
                    checkFoodList(food.mamonan) ? "checked" : ""
                  }`}
                  onClick={() => handleCardClick(food.mamonan)}
                >
                  <img src={img} alt="" className="card-image" />
                  <div className="card-info">
                    <div className="card-header">{food.tenmonan}</div>
                    <div className="card-body">
                      <p>{formatCurrency(food.dongia)}</p>
                      {/* <input
                        type="checkbox"
                        name="danhsachmonan"
                        value={food.mamonan}
                        style={{ display: "none" }}
                        checked={checkFoodList(food.mamonan)}
                        onChange={handleFoodCheckboxChange}
                      /> */}
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
