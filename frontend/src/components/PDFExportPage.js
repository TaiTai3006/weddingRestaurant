import React from "react";
import "../style/report.css";
function PDFExportPage({ order }) {
  return (
    <div className="pdf-container">
      <div className="report-content">
        <h4>Thông tin hóa đơn {order.matieccuoi} </h4>
        <div className="view-row">
          <div className="view-column">
            <div className="form-row">
              <label htmlFor="tencodau">Mã tiệc cưới:</label>
              <span> {order.matieccuoi}</span>
            </div>
            <div className="form-row">
              <label htmlFor="tencodau">Tên cô dâu:</label>
              <span> {order.tencodau}</span>
            </div>
            <div className="form-row">
              <label htmlFor="tencodau">Tên chú rể:</label>
              <span> {order.tenchure}</span>
            </div>
            <div className="form-row">
              <label htmlFor="address">Địa chỉ:</label>
              <span className="">{order.diachi}</span>
            </div>
            <div className="form-row">
              <label htmlFor="sodienthoai">Số điện thoại:</label>
              <span> {order.sdt}</span>
            </div>
          </div>
          <div className="view-column">
            <div className="form-row">
              <label>Ngày đặt:</label>
              <span className="">{order.ngaydat}</span>
            </div>
            <div className="form-row">
              <label>Ngày tổ chức:</label>
              <span className="">{order.ngaydaitiec}</span>
            </div>
            <div className="form-row">
              <label>Ca:</label>
              <span className="">{order.maca}</span>
            </div>
            <div className="form-row">
              <label>Sảnh:</label>
              <span className="">{order.masanh}</span>
            </div>
          </div>
        </div>
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

        

        {order.danhsachdichvu.length > 0 && (
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
                {order.danhsachdichvu.map((dichVu, index) => (
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
                  <td>{order.tongtiendichvu}</td>
                </tr>
              </tbody>
            </table>
           
          </div>
        )}

        <p className="total_price">Thành tiền  : {order.tongtienban}</p>
        <p className="total_price">Số tiền đã trả   : {order.tiendatcoc}</p>
        <p className="total_price">Còn lại   : {order.conlai}</p>
        
      </div>
    </div>
  );
}

export default PDFExportPage;
