import React, { useEffect } from "react";
import img from "../images/myudon.jpg";
import { useDispatch, useSelector } from "react-redux";
import { GrFormPrevious } from "react-icons/gr";
import { fetchWeddingServices } from "../redux/actions/actionCreators";
const ServiceInfoTab = ({
  formErrors,
  selectedTabIndex,
  handleTabChange,
  wedding,
  setWedding,
  location,
}) => {
  const dispatch = useDispatch();
  const weddingServices = useSelector((state) => state.weddingServices);

  useEffect(() => {
    // dispatch(fetchWeddingServices());
  }, [location]);

  const serviceList = wedding?.danhsachdichvu ? wedding?.danhsachdichvu : [];

  const checkServiceList = (madichvu) => {
    return serviceList.find((food) => food?.madichvu === madichvu) ? true : false;
  };

  const handleCardClick = (service) => {
    if (!checkServiceList(service.madichvu)) {
      wedding = {
        ...wedding,
        danhsachdichvu: [
          ...wedding.danhsachdichvu,
          { madichvu: service.madichvu, dongiadichvu: service.dongia, soluong: 1, thanhtien: service.dongia},
        ],
      };

      setWedding(wedding);
      localStorage.setItem("formWedding", JSON.stringify(wedding));

    } else{

      const serviceList = wedding.danhsachdichvu;
      const newServiceList = serviceList.filter(f => f.madichvu !== service.madichvu);
      wedding = {...wedding, danhsachdichvu: newServiceList}

      setWedding(wedding);
      localStorage.setItem("formWedding", JSON.stringify(wedding));
    }
  };

  const goToPreviousTab = () => {
    handleTabChange(null, selectedTabIndex - 1);
  };
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <div className="services-container">
      <button className="navigate-btn" onClick={goToPreviousTab}>
        <GrFormPrevious />{" "}
      </button>
      <div>
        <div className="card-container">
          {weddingServices.map((dichvu, index) => (
            <div
              key={index}
              className={`card ${
                checkServiceList(dichvu.madichvu) ? "checked" : ""
              }`}
              onClick={() => handleCardClick(dichvu)}
            >
              <img src={img} alt="" className="card-image" />
              <div className="card-info">
                <div className="card-header">{dichvu.tendichvu}</div>
                <div className="card-body">
                  <p> {formatCurrency(parseFloat(dichvu.dongia))}</p>
                  {/* <input
                    type="checkbox"
                    name="danhsachdichvu"
                    value={dichvu.madichvu}
                    style={{ display: "none" }}
                    checked={checkedServices.includes(dichvu.madichvu)}
                    onChange={handleServiceCheckboxChange}
                  /> */}
                </div>
              </div>
            </div>
          ))}
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
