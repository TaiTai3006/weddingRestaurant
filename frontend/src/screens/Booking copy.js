import React, { useState, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useSelector, useDispatch } from "react-redux";
import { updateFormData } from "../redux/actions/action";
import "../style/booking.css";
import { Link } from "react-router-dom";
import OrderInfo from "../components/OrderInfo";
import OrderInfoTab from "../components/OrderInfoTab";

function Booking() {
  const formData = useSelector((state) => state.formData);

  const weddingHalls = useSelector((state) => state.weddingHalls);

  const weddingServices = useSelector((state) => state.weddingServices);
  const weddingFoods = useSelector((state) => state.weddingFoods);
  const weddingShifts = useSelector((state) => state.weddingShifts);
  const invoices = useSelector((state) => state.invoices);

  const dispatch = useDispatch();

  const [checkedFoods, setCheckedFoods] = useState([]);
  const [checkedServices, setCheckedServices] = useState([]);

  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const filteredSanhs = weddingHalls.filter((sanh) => {
    // Check if the hall type matches the selected hall type
    const isHallMatch = formData.sanh === "" || sanh.loaiSanh === formData.sanh;

    invoices.map((item) => {
      console.log(item.ngaydaitiec);
    });

    // Check if there is no existing invoice for the same hall and shift combination on the event date
    const isHallShiftCombinationValid = weddingShifts.every((ca) => {
      console.log(sanh.maSanh, ca.maCa, formData.ngaydaitiec);

      const isInvoiceExist = invoices.some(
        (invoice) =>
          invoice.masanh === sanh.maSanh &&
          invoice.maca === ca.maCa &&
          // Assuming the event date is stored in the form data as `ngayDaiTiec`
          invoice.ngaydaitiec === formData.ngaydaitiec
      );

      return !isInvoiceExist;
    });
    console.log(isHallShiftCombinationValid);

    // Return true if the hall type matches and there are no conflicting hall-shift combinations
    return isHallMatch && isHallShiftCombinationValid;
  });

  console.log(filteredSanhs);

  const minTotalAmount = 1000;

  const foodTypes = weddingFoods.reduce((types, food) => {
    if (!types.includes(food.loaiMonAn)) {
      types.push(food.loaiMonAn);
    }
    return types;
  }, []);

  const serviceTypes = weddingServices.reduce((types, service) => {
    if (!types.includes(service.loaiDichVu)) {
      types.push(service.loaiDichVu);
    }
    return types;
  }, []);

  return (
    <div className="booking-container">
      <div className="booking-tabs">
        <Tabs>
          <TabList>
            <Tab>Thông tin tiệc cưới</Tab>
            <Tab>Thông tin món ăn</Tab>
            <Tab>Thông tin dịch vụ</Tab>
          </TabList>

          <TabPanel>
          <OrderInfoTab
              formData={formData}
              weddingHalls={weddingHalls}
              weddingShifts={weddingShifts}
              handleChange={handleChange}
            />
          </TabPanel>

          <TabPanel>
            <div className="foods-container">
              <div>
                <h2>Chọn loại món ăn</h2>
                <select
                  value={selectedFoodType}
                  onChange={(e) => setSelectedFoodType(e.target.value)}
                >
                  <option value="">Chọn loại món ăn</option>
                  {Object.keys(foodTypes).map((type) => (
                    <option key={type} value={foodTypes[type]}>
                      {foodTypes[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h2>Danh sách món ăn</h2>
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã món ăn</th>
                      <th>Tên món ăn</th>
                      <th>Đơn giá</th>
                      <th>Chọn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedFoodType
                      ? weddingFoods
                          .filter((food) => food.loaiMonAn === selectedFoodType)
                          .map((food, index) => (
                            <tr key={food.maMonAn}>
                              <td>{index + 1}</td>
                              <td>{food.maMonAn}</td>
                              <td>{food.tenMonAn}</td>
                              <td>{food.donGia} USD</td>
                              <td>
                                <input
                                  type="checkbox"
                                  name="danhsachmonan"
                                  value={food.maMonAn}
                                  checked={checkedFoods.includes(food.maMonAn)}
                                  onChange={handleFoodCheckboxChange}
                                />
                              </td>
                            </tr>
                          ))
                      : weddingFoods.map((food, index) => (
                          <tr key={food.maMonAn}>
                            <td>{index + 1}</td>
                            <td>{food.maMonAn}</td>
                            <td>{food.tenMonAn}</td>
                            <td>{food.donGia} USD</td>
                            <td>
                              <input
                                type="checkbox"
                                name="danhsachmonan"
                                value={food.maMonAn}
                                checked={checkedFoods.includes(food.maMonAn)}
                                onChange={handleFoodCheckboxChange}
                              />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
                <p style={{ color: "red" }}>{warningMessage}</p>{" "}
              </div>
            </div>
          </TabPanel>

          <TabPanel>
            <div className="services-container">
              <div>
                <h2>Chọn loại dịch vụ </h2>
                <select
                  value={selectedServiceType}
                  onChange={(e) => setSelectedServiceType(e.target.value)}
                >
                  <option value="">Chọn loại dịch vụ </option>
                  {Object.keys(serviceTypes).map((type) => (
                    <option key={type} value={serviceTypes[type]}>
                      {serviceTypes[type]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h2>Danh sách dịch vụ</h2>
                <table>
                  <thead>
                    <tr>
                      <th>STT</th>
                      <th>Mã dịch vụ</th>
                      <th>Tên dịch vụ</th>
                      <th>Số lượng</th>
                      <th>Đơn giá</th>
                      <th>Chọn</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServiceType
                      ? weddingServices
                          .filter(
                            (service) =>
                              service.loaiDichVu === selectedServiceType
                          )
                          .map((service, index) => (
                            <tr key={service.maDichVu}>
                              <td>{index + 1}</td>
                              <td>{service.maDichVu}</td>
                              <td>{service.tenDichVu}</td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  name="quantity"
                                  value={
                                    // formData.danhsachdichvu[index]?.soluong ||
                                    1
                                  }
                                  onChange={(e) =>
                                    handleQuantityChange(
                                      service, // Truyền mã dịch vụ để xác định dịch vụ cần cập nhật
                                      e.target.value, // Truyền giá trị số lượng mới
                                      e.target.checked // Truyền trạng thái của checkbox
                                    )
                                  }
                                />
                              </td>
                              <td>{service.donGia}D</td>
                              <td>
                                <input
                                  type="checkbox"
                                  name="danhsachdichvu"
                                  value={service.maDichVu}
                                  checked={checkedServices.includes(
                                    service.maDichVu
                                  )}
                                  onChange={handleChange}
                                />
                              </td>
                            </tr>
                          ))
                      : weddingServices.map((service, index) => (
                          <tr key={service.maDichVu}>
                            <td>{index + 1}</td>
                            <td>{service.maDichVu}</td>
                            <td>{service.tenDichVu}</td>
                            <td>
                              <input
                                type="number"
                                min="1"
                                name="quantity"
                                value={
                                  // formData.danhsachdichvu[index]?.soluong ||
                                  1
                                }
                                onChange={(e) =>
                                  handleQuantityChange(
                                    service,
                                    e.target.value,
                                    e.target.checked
                                  )
                                }
                              />
                            </td>
                            <td>{service.donGia} USD</td>
                            <td>
                              <input
                                type="checkbox"
                                name="danhsachdichvu"
                                value={service.maDichVu}
                                checked={checkedServices.includes(
                                  service.maDichVu
                                )}
                                onChange={handleChange}
                              />
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabPanel>
        </Tabs>
      </div>
      {/* Order information */}
      <OrderInfo />
    </div>
  );
}

export default Booking;
