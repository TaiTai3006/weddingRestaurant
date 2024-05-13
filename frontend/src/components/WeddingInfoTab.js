import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormErrors, updateFormData } from "../redux/actions/action";
import dayjs from "dayjs";
import img from "../images/sanhhoa.jpeg";
import { MdNavigateNext } from "react-icons/md";

import {
  fetchAvailablelobbiesList,
  fetchShifts,
} from "../redux/actions/actionCreators";

const WeddingInfoTab = ({
  handleTabChange,
  selectedTabIndex,
  location,
  wedding,
  setWedding,
}) => {
  //
  const dispatch = useDispatch();

  const weddingShifts = useSelector((state) => state.weddingShifts);
  const weddingHalls = useSelector((state) => state.hallAvailable);

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  useEffect(() => {
    dispatch(fetchShifts());
  }, [location]);

  useEffect(() => {
    if (wedding.maca && wedding.ngaydaitiec) {
      dispatch(fetchAvailablelobbiesList(wedding.maca, wedding.ngaydaitiec));
    }
  }, [wedding]);

  const handleChoicePartyDay = (e) => {
    wedding = { ...wedding, ngaydaitiec: e.target.value };

    setWedding(wedding);
    localStorage.setItem("formWedding", JSON.stringify(wedding));
  };

  const handleSelectShiftKey = (e) => {
    wedding = { ...wedding, maca: e.target.value };

    setWedding(wedding);
    localStorage.setItem("formWedding", JSON.stringify(wedding));
  };

  const handleSelectHall = (masanh) => {
    wedding = { ...wedding, masanh: masanh };
    
    setWedding(wedding);
    localStorage.setItem("formWedding", JSON.stringify(wedding));
  };
  //

  const goToNextTab = () => {
    if (validateForm()) {
      handleTabChange(null, selectedTabIndex + 1);
    }
  };

  const [selectedHallType, setSelectedHallType] = useState("");

  const formErrors = useSelector((state) => state.formErrors);

  useEffect(() => {
    const currentDate = dayjs();
    const formattedCurrentDate = currentDate.format("YYYY-MM-DD");
    dispatch(updateFormData({ ngaydat: formattedCurrentDate }));
  }, [dispatch]);

  // useEffect(() => {
  //   // Lưu thông tin formData vào local storage
  //   localStorage.setItem("formData", JSON.stringify(formData));
  // }, [formData]);
  // useEffect(() => {
  //   // Lấy dữ liệu từ local storage nếu có
  //   const storedFormData = JSON.parse(localStorage.getItem("formData"));
  //   if (storedFormData) {
  //     setFormData(storedFormData);
  //   }
  // }, []);

  const validateForm = () => {
    const errors = {};

    // if (!formData.ngaydaitiec) {
    //   errors.ngaydaitiec = "Ngày đãi tiệc không được để trống";
    // }
    // if (!formData.maca) {
    //   errors.maca = "Vui lòng chọn ca";
    // }
    // if(!checkedHalls){
    //   errors.halls = "Vui lòng chọn sảnh "
    // }

    dispatch(updateFormErrors(errors));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleTabChange(null, selectedTabIndex + 1);
    }
  };

  return (
    <div className="wedding-container">
      <button type="submit" className="navigate-btn" onClick={goToNextTab}>
        <MdNavigateNext />
      </button>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="input-form">
              <label htmlFor="ngaydaitiec">Ngày đãi tiệc:</label>
              <input
                type="date"
                id="ngaydaitiec"
                name="ngaydaitiec"
                value={wedding.ngaydaitiec}
                onChange={handleChoicePartyDay}
              />
              {formErrors.formErrors.ngaydaitiec && (
                <span className="error-message">
                  {formErrors.formErrors.ngaydaitiec}
                </span>
              )}
            </div>
            <div className="input-form">
              <label htmlFor="ca">Ca:</label>
              <select
                id="ca"
                name="maca"
                value={wedding.maca}
                onChange={handleSelectShiftKey}
              >
                <option value="">Chọn ca</option>
                {weddingShifts.map((ca) => (
                  <option key={ca.maca} value={ca.maca}>
                    {ca.tenca} ({ca.giobatdau?.slice(0, -3)} -{" "}
                    {ca.gioketthuc?.slice(0, -3)})
                  </option>
                ))}
              </select>
              {formErrors.formErrors.maca && (
                <span className="error-message">
                  {formErrors.formErrors.maca}
                </span>
              )}
            </div>
          </div>
        </form>
      </div>
      <div className="hall-container">
        {weddingHalls
          .filter(
            (hall) =>
              selectedHallType === "" || hall.maloaisanh === selectedHallType
          )
          .map((hall) => (
            <div
              key={hall.masanh}
              className={`card-hall ${
                wedding.masanh === hall.masanh ? "checked" : ""
              }`}
              onClick={() => handleSelectHall(hall.masanh)}
            >
              <img
                src={hall.img ? hall.img : img}
                alt=""
                className="card-hall-image"
              />
              <div className="card-hall-info">
                <div className="card-hall-header">{hall.tensanh}</div>
                <div className="card-hall-body">
                  <p>{hall.thongtinloaisanh.tenloaisanh}</p>
                  <p>Số lượng bàn tối đa : {hall.soluongbantoida}</p>
                  <p>
                    Đơn bàn tối thiểu :{" "}
                    {formatCurrency(
                      parseFloat(hall.thongtinloaisanh.dongiabantoithieu)
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
      {formErrors.formErrors.sanh && (
        <span className="error-message">{formErrors.formErrors.sanh}</span>
      )}
    </div>
  );
};

export default WeddingInfoTab;
