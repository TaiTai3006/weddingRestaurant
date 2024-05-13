import React, { useState, useEffect } from "react";
import "react-tabs/style/react-tabs.css";
import { useSelector, useDispatch } from "react-redux";
import { updateFormErrors } from "../redux/actions/action";
import "../style/booking.css";
import OrderInfo from "../components/OrderInfo";
import WeddingInfoTab from "../components/WeddingInfoTab";
import FoodInfoTab from "../components/FoodInfoTab";
import ServiceInfoTab from "../components/ServiceInfoTab";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";
import { useLocation } from "react-router-dom";

function Booking() {
  const dispatch = useDispatch();
  const formErrors = useSelector((state) => state.formErrors);
  const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const location = useLocation();

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };

  const dataLocalStorage = localStorage.getItem("formWedding");

  const initialWeddingState = {
    matieccuoi: null,
    ngaydat: null,
    ngaydaitiec: null,
    soluongban: 20,
    soluongbandutru: null,
    dongiaban: null,
    tongtienban: null,
    tongtiendichvu: null,
    tongtiendattiec: null,
    tiendatcoc: null,
    conlai: null,
    tencodau: null,
    tenchure: null,
    sdt: null,
    tinhtrangphancong: null,
    maca: null,
    masanh: null,
    username: null,
    danhsachdichvu: [],
    danhsachmonan: [],
  };

  const [wedding, setWedding] = useState(
    dataLocalStorage ? JSON.parse(dataLocalStorage) : initialWeddingState
  );
  console.log(wedding, "ahdghsgf");
  // localStorage.clear();

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    setWedding((prevWedding) => ({ ...prevWedding, ngaydat: formattedDate }));
  }, [location]);

  const validateForm = () => {
    const errors = {};
    // if (!formData.ngaydaitiec && !formData.maca && !formData.masanh) {
    //   errors.tttieccuoi = "Vui lòng điền thông tin tiệc cưới";
    // }
    // if (!formData.danhsachdichvu.length != 0) {
    //   errors.danhsachdichvu = "Vui lòng chọn dịch vụ ";
    // }
    // if (!formData.danhsachmonan.length != 0) {
    //   errors.foods = "Vui lòng chọn món ăn  ";
    // }
    // if (!formData.tencodau) {
    //   errors.tencodau = "Tên cô dâu không được để trống";
    // }
    // if (!formData.tenchure) {
    //   errors.tenchure = "Tên chú rể không được để trống";
    // }
    // if (!formData.sdt) {
    //   errors.sdt = "Số điện thoại không được để trống";
    // } else if (!/^\d+$/.test(formData.sdt)) {
    //   errors.sdt = "Số điện thoại không hợp lệ";
    // }
    // if (!formData.ngaydat) {
    //   errors.ngaydat = "Ngày đặt không được để trống";
    // }

    // if (!formData.maca) {
    //   errors.maca = "Vui lòng chọn ca";
    // }
    // if (!formData.sanh) {
    //   errors.sanh = "Vui lòng chọn sảnh phù hợp";
    // }
    // dieu kien tong tien mon an phai lon hon don dat
    dispatch(updateFormErrors(errors));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    if (validateForm()) {
      navigate("/orderconfirm");
    }
  };
  return (
    <div className="booking-container">
      <div className="booking-tabs">
        <Tabs value={selectedTabIndex} className="custom-tabs">
          <Tab label="Thông tin tiệc cưới" />
          <Tab label="Thông tin món ăn" />
          <Tab label="Thông tin dịch vụ" />
        </Tabs>
        {selectedTabIndex === 0 && (
          <WeddingInfoTab
            selectedTabIndex={selectedTabIndex}
            handleTabChange={handleTabChange}
            wedding={wedding}
            setWedding={setWedding}
            location={location}
          />
        )}
        {selectedTabIndex === 1 && (
          <FoodInfoTab
            formErrorsWedding={formErrors}
            selectedTabIndex={selectedTabIndex}
            handleTabChange={handleTabChange}
            wedding={wedding}
            setWedding={setWedding}
            location={location}
          />
        )}
        {selectedTabIndex === 2 && (
          <ServiceInfoTab
            selectedTabIndex={selectedTabIndex}
            formErrors={formErrors}
            handleTabChange={handleTabChange}
            wedding={wedding}
            setWedding={setWedding}
            location={location}
          />
        )}
      </div>
      <OrderInfo
        handleSubmit={handleSubmit}
        formErrors={formErrors}
        wedding={wedding}
        setWedding={setWedding}
        location={location}
      />
    </div>
  );
}

export default Booking;
