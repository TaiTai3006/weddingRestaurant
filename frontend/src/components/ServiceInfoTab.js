import React,{useEffect} from "react";
import img from "../images/myudon.jpg";
import { GrFormPrevious } from "react-icons/gr";
const ServiceInfoTab = ({
  formData,
  selectedServiceType,
  serviceTypes,
  weddingServices,
  checkedServices,
  handleQuantityChange,
  handleChange,
  setSelectedServiceType,
  handleServiceCheckboxChange,
  handleSubmit,
  formErrors,
  selectedTabIndex,
  handleTabChange,
  setCheckedServices
}) => {
  useEffect(() => {
    // Lấy dữ liệu từ local storage nếu có
    const storedCheckedServices = JSON.parse(localStorage.getItem("checkedServices"));
    if (storedCheckedServices) {
      setCheckedServices(storedCheckedServices);
    }
  }, []);

  useEffect(() => {
    // Lưu checkedServices vào local storage mỗi khi nó thay đổi
    localStorage.setItem("checkedServices", JSON.stringify(checkedServices));
  }, [checkedServices]);

  const goToPreviousTab = () => {
    handleTabChange(null,selectedTabIndex- 1);
  };
  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  const handleCardClick = (mamonan) => {
    
    const isChecked = checkedServices.includes(mamonan);
    const updatedCheckedServices = isChecked
      ? checkedServices.filter((id) => id !== mamonan)
      : [...checkedServices, mamonan];
    setCheckedServices(updatedCheckedServices);
  };
  return (
    <div className="services-container">
        
        <button className="navigate-btn" onClick={goToPreviousTab}><GrFormPrevious /> </button>
        <div>
          <div className="card-container">
          {weddingServices.map((dichvu, index) => (
              <div
                key={index}
                className={`card ${
                  checkedServices.includes(dichvu.madichvu) ? "checked" : ""
                }`}
                onClick={() => handleCardClick(dichvu.madichvu)}
              >
                <img src={img} alt="" className="card-image" />
                <div className="card-info">
                  <div className="card-header">{dichvu.tendichvu}</div>
                  <div className="card-body">
                    <p> {formatCurrency(parseFloat(dichvu.dongia))}</p>
                    <input
                      type="checkbox"
                      name="danhsachdichvu"
                      value={dichvu.madichvu}
                      style={{ display: "none" }}
                      checked={checkedServices.includes(dichvu.madichvu)}
                      onChange={handleServiceCheckboxChange}
                    />
                   
                  </div>
                </div>
              </div>))}
          </div>
           
           
          {formErrors.formErrors.danhsachdichvu && (
            <span style={{ color: "red", fontStyle: "italic", fontSize: 13 }}>
              {formErrors.formErrors.danhsachdichvu}
            </span>
          )}
        </div>
     
      
    </div>
  );
};

export default ServiceInfoTab;
