import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils";

const OrderInfo = ({
  formData,
  handleChange,
  weddingHalls,
  weddingShifts,
  weddingFoods,
  weddingServices,
  formErrors,
  checkedFoods,
  checkedServices,
  handleSubmit,
  checkedHalls,
}) => {
  const selectedHall = weddingHalls.find(
    (hall) => hall.masanh === checkedHalls
  );

  const selectedShift = weddingShifts.find(
    (hall) => hall.maCa === formData.maca
  );

  const selectedFoods = weddingFoods.filter((food) =>
    checkedFoods.includes(food.mamonan)
  );
  const selectedServices = weddingServices.filter((dichvu) =>
    checkedServices.includes(dichvu.madichvu)
  );

  const [foodDetails, setFoodDetails] = useState([]);
  const [serviceDetails, setServiceDetails] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu từ local storage nếu có
    const foodDetailsFromStorage = JSON.parse(localStorage.getItem("foodDetails"));
    const serviceDetailsFromStorage = JSON.parse(localStorage.getItem("serviceDetails"));
    
    // Khởi tạo giá trị ban đầu từ local storage hoặc từ dữ liệu mới nếu không có dữ liệu trong local storage
    if (foodDetailsFromStorage) {
      setFoodDetails(foodDetailsFromStorage);
    } else {
      setFoodDetails(selectedFoods.map((food) => ({
        mamonan: food.mamonan,
        soluong: 1,
        ghichu: "",
      })));
    }
    
    if (serviceDetailsFromStorage) {
      setServiceDetails(serviceDetailsFromStorage);
    } else {
      setServiceDetails(selectedServices.map((service) => ({
        madichvu: service.madichvu,
        soluong: 1,
        ghichu: "",
      })));
    }
  }, []);
  console.log(foodDetails);
  console.log(serviceDetails)

  // Lưu trữ dữ liệu vào local storage mỗi khi foodDetails hoặc serviceDetails thay đổi
  useEffect(() => {
    localStorage.setItem("foodDetails", JSON.stringify(foodDetails));
  }, [foodDetails]);

  useEffect(() => {
    localStorage.setItem("serviceDetails", JSON.stringify(serviceDetails));
  }, [serviceDetails]);

  const handleQuantityChangeFood = (mamonan, quantity) => {
    const updatedFoodDetails = foodDetails.map((food) => {
      if (food.mamonan === mamonan) {
        return {
          ...food,
          soluong: parseInt(quantity),
        };
      }
      return food;
    });
    setFoodDetails(updatedFoodDetails);
  };

  const handleNoteChangeFood = (mamonan, note) => {
    const updatedFoodDetails = foodDetails.map((food) => {
      if (food.mamonan === mamonan) {
        return {
          ...food,
          ghichu: note,
        };
      }
      return food;
    });
    setFoodDetails(updatedFoodDetails);
  };

  const handleQuantityChangeService = (madichvu, quantity) => {
    const updatedServiceDetails = serviceDetails.map((service) => {
      if (service.madichvu === madichvu) {
        return {
          ...service,
          soluong: parseInt(quantity),
        };
      }
      return service;
    });
    setServiceDetails(updatedServiceDetails);
  };

  const handleNoteChangeService = (madichvu, note) => {
    const updatedServiceDetails = serviceDetails.map((service) => {
      if (service.madichvu === madichvu) {
        return {
          ...service,
          ghichu: note,
        };
      }
      return service;
    });
    setServiceDetails(updatedServiceDetails);
  };

  const handlePayment = () => {
    // chi tiết món ăn && chi tiết dịch vụ
    console.log(selectedFoods);
    console.log(selectedServices);
    handleSubmit();
    localStorage.clear();
  };
  return (
    <div className="summary-container">
      <h2>Thông tin đặt tiệc </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="input-form">
            <label htmlFor="tencodau">Tên chú rể :</label>
            <input
              type="text"
              id="tenchure"
              name="tenchure"
              value={formData.tenchure}
              onChange={handleChange}
            />
            {formErrors.formErrors.tenchure && (
              <span className="error-message">
                {formErrors.formErrors.tenchure}
              </span>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="input-form">
            <label htmlFor="tencodau">Tên cô dâu :</label>
            <input
              type="text"
              id="tencodau"
              name="tencodau"
              value={formData.tencodau}
              onChange={handleChange}
            />
            {formErrors.formErrors.tencodau && (
              <span className="error-message">
                {formErrors.formErrors.tencodau}
              </span>
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="input-form">
            <label htmlFor="sdt">Số điện thoại:</label>
            <input
              type="text"
              id="sdt"
              name="sdt"
              value={formData.sdt}
              onChange={handleChange}
            />
            {formErrors.formErrors.sdt && (
              <span className="error-message">{formErrors.formErrors.sdt}</span>
            )}
          </div>
        </div>
        <div className="form-row">
          <label>Ngày đặt:</label>
          <span>{formData.ngaydat}</span>
          <label>Ngày tổ chức:</label>
          <span>{formData.ngaydaitiec}</span>
        </div>
        {selectedShift && (
          <div className="form-row">
            <label>Ca:</label>
            <span>{selectedShift.tenCa}</span>
            <label htmlFor=""> Thời gian : </label>
            <span>{`${selectedShift.gioBatDau} - ${selectedShift.gioKetThuc}`}</span>
          </div>
        )}

        {selectedHall && (
          <div className="form-row">
            <label>Tên sảnh:</label>
            <span>{selectedHall.tensanh}</span>
            <label>Số bàn tối đa:</label>
            <span>{selectedHall.soluongbantoida}</span>
          </div>
        )}
      </form>

      {selectedFoods.length > 0 && (
        <div>
          <strong>Món ăn đã chọn:</strong>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên món ăn</th>
                <th>Số lượng</th>
                <th>Ghi chú</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {selectedFoods.map((monan, index) => {
                const foodDetail = foodDetails.find(
                  (food) => food.mamonan === monan.mamonan
                );

                if (!foodDetail) {
                  const newFoodDetail = {
                    mamonan: monan.mamonan,
                    soluong: 1, // Giá trị mặc định của số lượng
                    ghichu: "", // Giá trị mặc định của ghi chú
                  };
                  foodDetails.push(newFoodDetail);
                }

                const soluong = foodDetail ? foodDetail.soluong : 1;
                const subtotal = parseFloat(monan.dongia) * soluong;

                return (
                  <tr key={index}>
                    <td className="stt">{index + 1}</td>
                    <td>{monan.tenmonan}</td>
                    <td className="quantity">
                      <input
                        type="number"
                        value={foodDetail ? foodDetail.soluong : 1 }
                        onChange={(e) =>
                          handleQuantityChangeFood(
                            monan.mamonan,
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={foodDetail ? foodDetail.ghichu : ""}
                        onChange={(e) =>
                          handleNoteChangeFood(monan.mamonan, e.target.value)
                        }
                      />
                    </td>
                    <td>{formatCurrency(parseFloat(monan.dongia))}</td>
                    <td>{formatCurrency(subtotal)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{ textAlign: "right" }}>
                  Tổng tiền món ăn:
                </td>
                <td>
                  {formatCurrency(
                    selectedFoods.reduce((total, monan) => {
                      const soluong = monan.soluong || 1;
                      const subtotal = parseFloat(monan.dongia) * soluong;
                      return total + subtotal;
                    }, 0)
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

{selectedServices.length > 0 && (
  <div>
    <strong>Dịch vụ đã chọn:</strong>
    <table>
      <thead>
        <tr>
          <th>STT</th>
          <th>Tên dịch vụ</th>
          <th>Số lượng</th>
          <th>Ghi chú</th>
          <th>Đơn giá</th>
          <th>Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        {selectedServices.map((dichvu, index) => {
          const serviceDetail = serviceDetails.find(
            (detail) => detail.madichvu === dichvu.madichvu
          );

          if (!serviceDetail) {
            const newServiceDetail = {
              madichvu: dichvu.madichvu,
              soluong: 1, // Giá trị mặc định của số lượng
              ghichu: "", // Giá trị mặc định của ghi chú
            };
            serviceDetails.push(newServiceDetail);
          }

          const soluong = serviceDetail ? serviceDetail.soluong : 1;
          const subtotal = parseFloat(dichvu.dongia) * soluong;

          return (
            <tr key={index}>
              <td className="stt">{index + 1}</td>
              <td>{dichvu.tendichvu}</td>
              <td className="quantity">
                <input
                  type="number"
                  value={soluong}
                  onChange={(e) =>
                    handleQuantityChangeService(
                      dichvu.madichvu,
                      e.target.value
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={serviceDetail ? serviceDetail.ghichu : ""}
                  onChange={(e) =>
                    handleNoteChangeService(dichvu.madichvu, e.target.value)
                  }
                />
              </td>
              <td>{formatCurrency(parseFloat(dichvu.dongia))}</td>
              <td>{formatCurrency(subtotal)}</td>
            </tr>
          );
        })}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="5" style={{ textAlign: "right" }}>
            Tổng tiền dịch vụ:
          </td>
          <td>
            {formatCurrency(
              selectedServices.reduce((total, dichvu) => {
                const serviceDetail = serviceDetails.find(
                  (detail) => detail.madichvu === dichvu.madichvu
                );
                const soluong = serviceDetail ? serviceDetail.soluong : 1;
                const subtotal = parseFloat(dichvu.dongia) * soluong;
                return total + subtotal;
              }, 0)
            )}
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
)}


      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
};

export default OrderInfo;
