import React, { useState, useEffect } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useSelector, useDispatch } from "react-redux";
import { updateFormData } from "../redux/actions/action";
import { updateFormErrors } from "../redux/actions/action";
import "../style/booking.css";
import OrderInfo from "../components/OrderInfo";
import WeddingInfoTab from "../components/WeddingInfoTab";
import FoodInfoTab from "../components/FoodInfoTab";
import ServiceInfoTab from "../components/ServiceInfoTab";
import { Link, useNavigate } from "react-router-dom";
import { Tab, Tabs } from "@mui/material";


function Booking() {
  const dispatch = useDispatch();
  // const formData = useSelector((state) => state.formData);
  const formErrors = useSelector((state) => state.formErrors);
  const navigate = useNavigate();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const foodTypes = useSelector((state) => state.foodTypes);
  const hallTypes = useSelector((state) => state.hallTypes);
  const weddingFoods = useSelector((state) => state.weddingFoods);
  const weddingHalls = useSelector((state) => state.weddingHalls);
  const weddingServices = useSelector((state) => state.weddingServices);
  const weddingShifts = useSelector((state) => state.weddingShifts);
  const invoices = useSelector((state) => state.invoices);
  const [formData, setFormData] = useState([]);
  console.log(formData);
  const [checkedFoods, setCheckedFoods] = useState([]);
  const [checkedServices, setCheckedServices] = useState([]);
  const [checkedHalls, setCheckedHalls] = useState();
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
 console.log(formErrors)

  const handleTabChange = (event, newValue) => {
    setSelectedTabIndex(newValue);
  };
 


  const minTotalAmount = 1000;
  const handleChange = (e) => {
    validateForm();
    const { name, value } = e.target;
   
      setFormData({ [name]: value });
      
  
  };

  

  const calculateTotalAmount = () => {
    
    // if (totalWeddingAmount < minTotalAmount) {
    //   setWarningMessage(`Tổng tiền phải lớn hơn ${minTotalAmount} USD`);
    // } else {
    //   setWarningMessage("");
    // }
  };

  const handleFoodCheckboxChange = (e) => {
    handleChange(e, "danhsachmonan");
  };

  const handleServiceCheckboxChange = (e) => {
    handleChange(e, "danhsachdichvu");
  };



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
            formData={formData}
            setFormData = {setFormData}
            weddingHalls={weddingHalls}
            weddingShifts={weddingShifts}
            hallTypes={hallTypes}
            checkedHalls={checkedHalls}
            setCheckedHalls={setCheckedHalls}
            // filteredSanhs={filteredSanhs}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formErrorsWedding={formErrors}
            selectedTabIndex={selectedTabIndex}
            handleTabChange={handleTabChange}
          />
        )}
        {selectedTabIndex === 1 && (
          <FoodInfoTab
            selectedFoodType={selectedFoodType}
            foodTypes={foodTypes}
            weddingFoods={weddingFoods}
            checkedFoods={checkedFoods}
            setCheckedFoods={setCheckedFoods}
            handleFoodCheckboxChange={handleFoodCheckboxChange}
            warningMessage={warningMessage}
            setSelectedFoodType={setSelectedFoodType}
            handleSubmit={handleSubmit}
            formErrorsWedding={formErrors}
            selectedTabIndex={selectedTabIndex}
            handleTabChange={handleTabChange}
          />
        )}
        {selectedTabIndex === 2 && (
          <ServiceInfoTab
            formData={formData}
            selectedServiceType={selectedServiceType}
            weddingServices={weddingServices}
            checkedServices={checkedServices}
            setCheckedServices={setCheckedServices}
            // handleQuantityChange={handleQuantityChange}
            handleChange={handleChange}
            selectedTabIndex={selectedTabIndex}
            handleServiceCheckboxChange={handleServiceCheckboxChange}
            handleSubmit={handleSubmit}
            formErrors={formErrors}
            handleTabChange={handleTabChange}
          />
        )}
      </div>
      <OrderInfo
        formData={formData}
        checkedFoods={checkedFoods}
        checkedServices={checkedServices}
        weddingFoods={weddingFoods}
        weddingServices={weddingServices}
        weddingHalls={weddingHalls}
        weddingShifts={weddingShifts}
        checkedHalls={checkedHalls}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        
        formErrors={formErrors}
      />
    </div>
  );
}

export default Booking;
