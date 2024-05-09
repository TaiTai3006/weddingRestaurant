import React, { useState, useEffect } from "react";
import ReportReview from "../screens/ReportReview";
import Modal from "react-modal";
import "../style/order.css";

const OrderTable = ({ orders }) => {
  const [openOrder, setOpenOrder] = useState(null);
  const [filterValues, setFilterValues] = useState({
    maDonHang: "",
    tenCoDau: "",
    tenChuRe: "",
    soDienThoai: "",
    sanh: "",
    ngayDat: "",
    ngayDaiTiec: "",
  });
  
  const [filteredOrders, setFilteredOrders] = useState(orders);
  
  useEffect(() => {
    filterOrders();
  }, [filterValues]);
  const filterOrders = () => {

    const filteredOrders = orders.filter((order) => {
      
      const maDonHangMatch = filterValues.maDonHang
        ? order.matieccuoi.includes(filterValues.maDonHang)
        : true;
      const tenCoDauMatch = filterValues.tenCoDau
        ? order.tencodau.includes(filterValues.tenCoDau)
        : true;
      const tenChuReMatch = filterValues.tenChuRe
        ? order.tenchure.includes(filterValues.tenChuRe)
        : true;
      const soDienThoaiMatch = filterValues.soDienThoai
        ? order.sdt.includes(filterValues.soDienThoai)
        : true;
      const sanhMatch = filterValues.sanh
        ? order.masanh.includes(filterValues.sanh)
        : true;
      const ngayDatMatch = filterValues.ngayDat
        ? order.ngaydat.includes(filterValues.ngayDat)
        : true;
      const ngayDaiTiecMatch = filterValues.ngayDaiTiec
        ? order.ngaydaitiec.includes(filterValues.ngayDaiTiec)
        : true;

     
      return (
        maDonHangMatch &&
        tenCoDauMatch &&
        tenChuReMatch &&
        soDienThoaiMatch &&
        sanhMatch &&
        ngayDatMatch &&
        ngayDaiTiecMatch
      );
    });

    // Cập nhật danh sách đơn hàng đã lọc
    setFilteredOrders(filteredOrders);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleReset = () => {
    setFilterValues({
      maDonHang: "",
      tenCoDau: "",
      tenChuRe: "",
      soDienThoai: "",
      maSanh: "",
      maCa: "",
      ngayDat: "",
      ngayDaiTiec: "",
    });
  };
  const toggleAccordion = (orderId) => {
    setOpenOrder(openOrder === orderId ? null : orderId);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  
  return (
    <div className="order-table">
      <h2>Tìm kiếm Đơn hàng</h2>
      <form className="form-columns" 
      // onSubmit={handleSearch}
      >
        <div className="form-column">
          <div className="form-row">
            <label>Mã đơn hàng:</label>
            <input
              type="text"
              name="maDonHang"
              placeholder="Nhập mã đơn hàng"
              value={filterValues.maDonHang}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Chú rể :</label>
            <input
              type="text"
              name="tenChuRe"
              placeholder="Nhập tên chú rể"
              value={filterValues.tenChuRe}
              onChange={handleInputChange}
            />
           
          </div>
          <div className="form-row">
            <label>Cô dâu :</label>
            <input
              type="text"
              name="tenCoDau"
              placeholder="Nhập tên cô dâu "
              value={filterValues.tenCoDau}
              onChange={handleInputChange}
            />
            
          </div>
        </div>
        <div className="form-column">
          <div className="form-row">
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="sdt"
              placeholder="Nhập số điện thoại "
              value={filterValues.sdt}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <label>Sảnh:</label>
            <input
              type="text"
              name="maSanh"
              placeholder="Nhập sảnh"
              value={filterValues.maSanh}
              onChange={handleInputChange}
            />
           
          </div>
          <div className="form-row">
            <label>Ca:</label>
            <input
              type="text"
              name="maCa"
              placeholder="Nhập mã phòng"
              value={filterValues.maCa}
              onChange={handleInputChange}
            />
            
          </div>
        </div>
        <div className="form-column form-column__last">
          <div className="form-column__top">
            <div className="form-row">
              <label>Ngày đặt:</label>
              <input
              type="date"
              name="ngayDat"
              placeholder="Nhập ngày đặt"
              value={filterValues.ngayDat}
              onChange={handleInputChange}
            />
              
            </div>
            <div className="form-row">
              <label>Ngày đãi tiệc:</label>
              <input
              type="date"
              name="ngayDaiTiec"
              placeholder="Nhập ngày đãi tiệc "
              value={filterValues.ngayDaiTiec}
              onChange={handleInputChange}
            />
              
            </div>
          </div>
          <div className="form-column__bottom">
            <div className=" form-buttons">
              <button className="btn-add" type="button">
                Thêm
              </button>
              <button className="btn-reset" type="reset" onClick={handleReset}>
                Nhập lại
              </button>
            </div>
          </div>
        </div>
      </form>
      <h2>Danh Sách Đơn hàng</h2>
      <table>
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Tên cô dâu </th>
            <th>Tên chú rể </th>
            <th>Số điện thoại </th>
            <th>Sảnh </th>
            <th>Ca</th>
            <th>Ngày đặt</th>
            <th>Ngày đãi tiệc</th>
            <th>Tình trạng </th>
          </tr>
        </thead>
        <tbody>
        {filteredOrders.map((order) => (
             <React.Fragment key={order.matieccuoi}>
             <tr onClick={() => toggleAccordion(order.matieccuoi)}>
               <td>{order.matieccuoi}</td>
               <td>{order.tencodau}</td>
               <td>{order.tenchure}</td>
               <td>{order.sdt}</td>
               <td>{order.masanh}</td>
               <td>{order.maca}</td>
               <td>{order.ngaydat}</td>
               <td>{order.ngaydaitiec}</td>
               <td>{order.tinhtrangphancong}</td>
             </tr>
             {openOrder === order.matieccuoi && (
               <tr>
                 <td colSpan="12">
                   <div className="accordion">
                     <form className="form-columns">
                       <div className="form-column">
                         <div className="form-row">
                           <label>Mã đơn hàng:</label>
                           <input
                             type="text"
                             value={order.matieccuoi}
                             readOnly
                           />
                         </div>

                         <div className="form-row">
                           <label>Chú rể:</label>
                           <input
                             type="text"
                             value={order.tenchure}
                             readOnly
                           />
                         </div>
                         <div className="form-row">
                           <label>Cô dâu :</label>
                           <input
                             type="text"
                             value={order.tencodau}
                             readOnly
                           />
                         </div>
                         <div className="form-row">
                           <label>Số điện thoại:</label>
                           <input type="text" value={order.sdt} readOnly />
                         </div>
                         <div className="form-row">
                           <label>Tình trạng:</label>
                           <input
                             type="text"
                             value={order.tinhtrangphancong}
                             readOnly
                           />
                         </div>
                       </div>
                       <div className="form-column">
                         <div className="form-row">
                           <label>Ngày đặt:</label>
                           <input type="text" value={order.ngaydat} readOnly />
                         </div>
                         <div className="form-row">
                           <label>Ngày đãi tiệc:</label>
                           <input
                             type="text"
                             value={order.ngaydaitiec}
                             readOnly
                           />
                         </div>
                         <div className="form-row">
                           <label>Số lượng:</label>
                           <input
                             type="text"
                             value={order.soluongban}
                             readOnly
                           />
                         </div>
                         <div className="form-row">
                           <label>Sảnh:</label>
                           <input type="text" value={order.masanh} readOnly />
                         </div>
                         <div className="form-row">
                           <label>Ca:</label>
                           <input type="text" value={order.maca} readOnly />
                         </div>
                       </div>
                     </form>
                     {order.danhsachdichvu.length > 0 && (
                       <div>
                         <strong>Dịch vụ :</strong>
                         <table>
                           <thead>
                             <tr>
                               <th>STT</th>
                               <th>Tên dịch vụ</th>
                               <th>Số lượng</th>
                               <th>Ghi chú</th>
                               <th>Đơn giá</th>
                               <th>Thành tiền</th> {/* Thêm cột mới */}
                             </tr>
                           </thead>
                           <tbody>
                             {order.danhsachdichvu.map((dichVu, index) => (
                               <tr key={index}>
                                 <td>{index + 1}</td>
                                 <td>{dichVu.tenDichVu}</td>
                                 <td>{dichVu.soluong}</td>
                                 <td>{dichVu.ghiChu}</td>
                                 <td>{dichVu.donGia}</td>
                                 
                                 <td>{dichVu.donGia * dichVu.soluong}</td>
                               </tr>
                             ))}

                             <tr>
                               <td colSpan="5" style={{ textAlign: "right" }}>
                                 Tổng tiền dịch vụ:
                               </td>
                               <td>{order.tongtiendichvu}</td>
                             </tr>
                           </tbody>
                         </table>
                       </div>
                     )}
                     {order.danhsachmonan.length > 0 && (
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
                             {order.danhsachmonan.map((monAn, index) => (
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
                               <td>{order.tongtiendattiec}</td>
                             </tr>
                           </tbody>
                         </table>
                       </div>
                     )}
                     <p className="total_price">
                       Thành tiền : {order.tongtienban}
                     </p>
                     <p className="total_price">
                       Số tiền đã trả : {order.tiendatcoc}
                     </p>
                     <p className="total_price">Còn lại : {order.conlai}</p>

                     <div className="button-group">
                       <button className="save">Save</button>
                       <button className="edit">Edit</button>
                       <div>
                         <button
                           className="export"
                           id="openModalBtn"
                           onClick={handleOpenModal}
                         >
                           Export
                         </button>

                         <Modal
                           isOpen={isModalOpen}
                           onRequestClose={handleCloseModal}
                           contentLabel="Report-review"
                           className="report-modal"
                         >
                           <ReportReview
                             order={order}
                             onClose={handleCloseModal}
                           />
                         </Modal>
                       </div>
                     </div>
                   </div>
                 </td>
               </tr>
             )}
           </React.Fragment>
          ))}
         
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
