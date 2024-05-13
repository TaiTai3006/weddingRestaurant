import React, { useEffect } from "react";
import { formatCurrency } from "../utils";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHalls,
  fetchWeddingFoods,
  fetchWeddingServices,
} from "../redux/actions/actionCreators";
const OrderInfo = ({
  formErrors,
  handleSubmit,
  wedding,
  setWedding,
  location,
}) => {
  const dispatch = useDispatch();
  const weddingShifts = useSelector((state) => state.weddingShifts);
  const weddingFoods = useSelector((state) => state.weddingFoods);
  const weddingServices = useSelector((state) => state.weddingServices);
  const halllist = useSelector((state) => state.weddingHalls);
  const foodList = wedding.danhsachmonan;
  const serviceList = wedding.danhsachdichvu;

  useSelector((state) => console.log(state));

  useEffect(() => {
    dispatch(fetchHalls());
    dispatch(fetchWeddingFoods());
    dispatch(fetchWeddingServices());
  }, [location]);

  useEffect(() => {
    if (
      wedding.soluong > 0 &&
      foodList.length() > 0 &&
      serviceList.length() > 0
    ) {
      const totalTableRevenue =
        foodList.reduce(
          (total, food) => food.dongiamonan * food.soluong + total,
          0
        ) * wedding.soluongban;
      const totalServiceRevenue = serviceList.reduce(
        (total, service) => service.soluong * service.dongiadichvu + total,
        0
      );
      const totalWeddingCost = totalTableRevenue + totalServiceRevenue;

      wedding = {
        ...wedding,
        tongtienban: totalTableRevenue,
        tongtiendichvu: totalServiceRevenue,
        tongtiendattiec: totalWeddingCost,
        
      };
    }
  }, [wedding.soluongban, foodList, halllist]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    wedding = { ...wedding, [name]: value };

    setWedding(wedding);
    localStorage.setItem("formWedding", JSON.stringify(wedding));
  };

  const formatDate = (dateString) => {
    const parts = dateString?.split("-");
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  const getShiftInfo = (maca) => {
    return weddingShifts.filter((shift) => shift.maca === maca)[0];
  };

  const getNameHall = (masanh) => {
    return halllist.filter((hall) => hall.masanh === masanh)[0]?.tensanh;
  };

  const getNameFood = (mamonan) => {
    return weddingFoods.filter((food) => food.mamonan === mamonan)[0]?.tenmonan;
  };

  const getNameService = (madichvu) => {
    return weddingServices.filter((service) => service.madichvu === madichvu)[0]
      ?.tendichvu;
  };

  const updateFoodInfo = (e, mamonan, quantityType) => {
    const { name, value } = e.target;
    const foodList = wedding.danhsachmonan;
    const newFoodList = foodList.map((food) =>
      food.mamonan === mamonan
        ? { ...food, [name]: quantityType ? parseInt(value) : value }
        : food
    );
    wedding = { ...wedding, danhsachmonan: newFoodList };

    setWedding(wedding);
    localStorage.setItem("formWedding", JSON.stringify(wedding));
  };

  const updateServiceInfo = (e, madichvu) => {
    const { name, value } = e.target;
    const sevriceList = wedding.danhsachdichvu;
    const newsevriceList = sevriceList.map((service) =>
      service.madichvu === madichvu
        ? { ...service, [name]: parseInt(value) }
        : service
    );
    wedding = { ...wedding, danhsachdichvu: newsevriceList };

    setWedding(wedding);
    localStorage.setItem("formWedding", JSON.stringify(wedding));
  };

  const handlePayment = () => {
    // chi tiết món ăn && chi tiết dịch vụ

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
              value={wedding.tenchure}
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
              value={wedding.tencodau}
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
              value={wedding.sdt}
              onChange={handleChange}
            />
            {formErrors.formErrors.sdt && (
              <span className="error-message">{formErrors.formErrors.sdt}</span>
            )}
          </div>
        </div>
        <div className="form-row">
          <label>Ngày đặt:</label>
          <span>{wedding.ngaydat ? formatDate(wedding.ngaydat) : ""}</span>
          <label>Ngày tổ chức:</label>
          <span>
            {wedding.ngaydaitiec ? formatDate(wedding.ngaydaitiec) : ""}
          </span>
        </div>
        {wedding.maca && (
          <div className="form-row">
            <label>Ca:</label>
            <span>{getShiftInfo(wedding.maca)?.tenca}</span>
            <label htmlFor=""> Thời gian : </label>
            <span>{`${getShiftInfo(wedding.maca)?.giobatdau.slice(
              0,
              -3
            )} - ${getShiftInfo(wedding.maca)?.gioketthuc.slice(0, -3)}`}</span>
          </div>
        )}

        {wedding.masanh && (
          <div className="form-row">
            <label>Tên sảnh:</label>
            <span>{getNameHall(wedding.masanh)}</span>
            <label>Số bàn:</label>
            <span>{wedding.soluongban}</span>
          </div>
        )}
      </form>

      {foodList.length > 0 && (
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
              {foodList.map((monan, index) => {
                return (
                  <tr key={index}>
                    <td className="stt">{index + 1}</td>
                    <td>{getNameFood(monan.mamonan)}</td>
                    <td className="quantity">
                      <input
                        type="number"
                        name="soluong"
                        value={monan.soluong}
                        onChange={(e) => {
                          updateFoodInfo(e, monan.mamonan, true);
                        }}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        name="ghichu"
                        value={monan.ghichu}
                        onChange={(e) => {
                          updateFoodInfo(e, monan.mamonan);
                        }}
                      />
                    </td>
                    <td>{formatCurrency(parseFloat(monan.dongiamonan))}</td>
                    <td>{formatCurrency(monan.soluong * monan.dongiamonan)}</td>
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
                    foodList.reduce(
                      (total, food) => food.dongiamonan * food.soluong + total,
                      0
                    )
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {serviceList.length > 0 && (
        <div>
          <strong>Dịch vụ đã chọn:</strong>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên dịch vụ</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {serviceList.map((dichvu, index) => {
                return (
                  <tr key={index}>
                    <td className="stt">{index + 1}</td>
                    <td>{getNameService(dichvu.madichvu)}</td>
                    <td className="quantity">
                      <input
                        type="number"
                        name="soluong"
                        value={dichvu.soluong}
                        onChange={(e) => updateServiceInfo(e, dichvu.madichvu)}
                      />
                    </td>
                    <td>{formatCurrency(parseFloat(dichvu.dongiadichvu))}</td>
                    <td>{formatCurrency(parseFloat(dichvu.thanhtien))}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" style={{ textAlign: "right" }}>
                  Tổng tiền dịch vụ:
                </td>
                <td>
                  {formatCurrency(
                    parseInt(
                      serviceList.reduce(
                        (total, service) =>
                          service.soluong * service.dongiadichvu + total,
                        0
                      )
                    )
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <button onClick={handlePayment}>Thanh toán</button>
      <p>Tổng tiền bàn: {wedding.tongtienban ? wedding.tongtienban : 0} </p>
    </div>
  );
};

export default OrderInfo;
