import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import "../style/orderconfirm.css";

function OrderConfirm() {
  const formData = useSelector((state) => state.formData);
  const weddingHalls = useSelector((state) => state.weddingHalls);
  const weddingShifts = useSelector((state) => state.weddingShifts);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const selectedHall = weddingHalls.find(
    (hall) => hall.maSanh === formData.masanh
  );
  const selectedShift = weddingShifts.find(
    (hall) => hall.maCa === formData.maca
  );
  return (
    <div className="order-container">
      <h2>Thông tin hóa đơn {formData.matieccuoi} </h2>
      <div className="view-row">
        <div className="view-column">
          <div className="form-row">
            <label htmlFor="tencodau">Mã tiệc cưới:</label>
            <span> {formData.matieccuoi}</span>
          </div>
          <div className="form-row">
            <label htmlFor="tencodau">Tên cô dâu:</label>
            <span> {formData.tencodau}</span>
          </div>
          <div className="form-row">
            <label htmlFor="tencodau">Tên chú rể:</label>
            <span> {formData.tenchure}</span>
          </div>
          <div className="form-row">
            <label htmlFor="address">Địa chỉ:</label>
            <span className="">{formData.diachi}</span>
          </div>
          <div className="form-row">
            <label htmlFor="sodienthoai">Số điện thoại:</label>
            <span> {formData.sdt}</span>
          </div>
        </div>
        <div className="view-column">
          <div className="form-row">
            <label>Ngày đặt:</label>
            <span className="">{formData.ngaydat}</span>
          </div>
          <div className="form-row">
            <label>Ngày tổ chức:</label>
            <span className="">{formData.ngaydaitiec}</span>
          </div>
         
          {selectedShift && (
            <div className="form-row">
              <label>Ca:</label>
              <span >{selectedShift.tenCa}</span> 
              <label htmlFor=""> Thời gian : </label>
              <span>{`${selectedShift.gioBatDau} - ${selectedShift.gioKetThuc}`}
               </span>
            </div>
          )}
          {selectedHall && (
        <div className="form-row">
          <label>Sảnh:</label>
          <span>{selectedHall.loaiSanh}</span> 
          <label>Tên sảnh:</label>
          <span>{selectedHall.tenSanh}</span> 
          <label>Số bàn tối thiểu:</label>
          <span>{selectedHall.soLuongBanToiThieu}</span> 
        </div>
      )}
        </div>
      </div>
      {formData.danhsachmonan.length > 0 && (
        <div>
          <strong>Món ăn:</strong>
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
              {formData.danhsachmonan.map((monAn, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{monAn.tenMonAn}</td>
                  <td>{monAn.soluong}</td>
                  <td>{monAn.description}</td>
                  <td>{monAn.donGia}</td>
                  <td>{monAn.donGia * monAn.soluong}</td>
                </tr>
              ))}

              <tr>
                <td colSpan="5" style={{ textAlign: "right" }}>
                  Tổng tiền món ăn:
                </td>
                <td>{formData.tongtiendattiec}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {formData.danhsachdichvu.length > 0 && (
        <div>
          <strong>Dịch vụ :</strong>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên dịch vụ</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th> {/* Thêm cột mới */}
              </tr>
            </thead>
            <tbody>
              {formData.danhsachdichvu.map((dichVu, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{dichVu.tenDichVu}</td>
                  <td>{dichVu.soluong}</td>
                  <td>{dichVu.donGia}</td>
                  <td>{dichVu.donGia * dichVu.soluong}</td>
                </tr>
              ))}

              <tr>
                <td colSpan="4" style={{ textAlign: "right" }}>
                  Tổng tiền dịch vụ:
                </td>
                <td>{formData.tongtiendichvu}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <p className="total_price">Thành tiền : {formData.tongtienban}</p>
      <p className="total_price">Số tiền đã trả : {formData.tiendatcoc}</p>
      <p className="total_price">Còn lại : {formData.conlai}</p>

      <button
        id="openModalBtn"
        class="payment-button"
        onClick={handleOpenModal}
      >
        Thanh toán
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Chọn phương thức thanh toán"
        className="payment-modal"
      >
        <h2>Chọn phương thức thanh toán</h2>
        <div className="button-group">
        <Link to="/cashpayment">
          <button onClick={handleCloseModal}>Tiền mặt</button>
        </Link>
        <Link to="/bankpayment">
          <button onClick={handleCloseModal}>Chuyển khoản</button>
        </Link>
        </div>
        
      </Modal>
    </div>
  );
}

export default OrderConfirm;
