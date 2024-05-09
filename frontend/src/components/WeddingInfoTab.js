import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateFormErrors, updateFormData } from "../redux/actions/action";
import dayjs from "dayjs";
import img from "../images/sanhhoa.jpeg";
import { MdNavigateNext } from "react-icons/md";
const WeddingInfoTab = ({
  formData,
  setFormData,
  weddingHalls,
  weddingShifts,
  handleChange,
  hallTypes,
  checkedHalls,
  setCheckedHalls,
  filteredSanhs,
  handleTabChange,
  formErrorsWedding,
  selectedTabIndex,
}) => {
  const goToNextTab = () => {
    if (validateForm()) {
      handleTabChange(null, selectedTabIndex + 1);
    }
  };

  const dispatch = useDispatch();
  const [selectedHallType, setSelectedHallType] = useState("");

  const formErrors = useSelector((state) => state.formErrors);
  console.log(formErrors);
  useEffect(() => {
    const currentDate = dayjs();
    const formattedCurrentDate = currentDate.format("YYYY-MM-DD");
    dispatch(updateFormData({ ngaydat: formattedCurrentDate }));
  }, [dispatch]);

  useEffect(() => {
    // Lưu thông tin formData vào local storage
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);
  useEffect(() => {
    // Lấy dữ liệu từ local storage nếu có
    const storedFormData = JSON.parse(localStorage.getItem("formData"));
    if (storedFormData) {
      setFormData(storedFormData);
    }
  }, []);

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

  const handleCardClick = (masanh) => {
    const isChecked = checkedHalls === masanh;
    const updatedCheckedHalls = isChecked ? "" : masanh;
    setCheckedHalls(updatedCheckedHalls);
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
                value={formData.ngaydaitiec}
                onChange={handleChange}
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
                value={formData.maca}
                onChange={handleChange}
              >
                <option value="">Chọn ca</option>
                {weddingShifts.map((ca) => (
                  <option key={ca.maCa} value={ca.maCa}>
                    {ca.tenCa}
                  </option>
                ))}
              </select>
              {formErrors.formErrors.maca && (
                <span className="error-message">
                  {formErrors.formErrors.maca}
                </span>
              )}
            </div>
            <div className="input-form">
              <label htmlFor="sanh">Sảnh:</label>
              <select
                id="sanh"
                name="sanh"
                value={formData.sanh}
                onChange={(e) => setSelectedHallType(e.target.value)}
              >
                <option value="">Chọn sảnh</option>
                {hallTypes.map((sanh) => (
                  <option key={sanh.maloaisanh} value={sanh.maloaisanh}>
                    {sanh.tenloaisanh}
                  </option>
                ))}
              </select>
              {formErrors.formErrors.halls && (
                <span className="error-message">
                  {formErrors.formErrors.halls}
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
                checkedHalls == hall.masanh ? "checked" : ""
              }`}
              onClick={() => handleCardClick(hall.masanh)}
            >
              <img src={img} alt="" className="card-hall-image" />
              <div className="card-hall-info">
                <div className="card-hall-header">{hall.tensanh}</div>
                <div className="card-hall-body">
                  <p>Số lượng bàn tối đa : {hall.soluongbantoida}</p>
                  <p>Ghi chú : {hall.ghichu}</p>
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
