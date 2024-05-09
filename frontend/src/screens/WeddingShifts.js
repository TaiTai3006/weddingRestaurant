import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWeddingShift, updateWeddingShift, deleteWeddingShift } from "../redux/actions/action";
import Modal from 'react-modal';
import EditShiftModal from '../components/EditShiftModal'; 
import AddShiftModal from "../components/AddShiftModal";


function WeddingShifts() {
  const dispatch = useDispatch();
  const weddingShifts = useSelector((state) => state.weddingShifts);
 console.log(weddingShifts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredShifts, setFilteredShifts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShiftData, setEditingShiftData] = useState(null); 

  useEffect(() => {
    setFilteredShifts(
      weddingShifts.filter((Shift) =>
        Shift.tenCa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Shift.maCa.toString().includes(searchTerm) ||
        Shift.loaiCa.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, weddingShifts]);

  const handleDelete = (maCa) => {
    dispatch(deleteWeddingShift(maCa)); 
  };
  const handleEdit = (Shift) => {
    setEditingShiftData(Shift); 
    setIsModalOpen(true); 
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingShiftData(null); 
  };



  return (
    <div className="category-container">
     
      <div className="category-header">
      <h2>Thông tin các sảnh </h2>
      <div className="search-bar">
      <input
          type="text"
          className="search-input"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
           
          </div>
    
      <button className="add_btn" onClick={handleAdd}>Thêm mới sảnh</button>
      </div>
      
      {filteredShifts.length > 0 && (
        <div className="list-category">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã ca</th>
                <th>Tên ca </th>
                <th>Giờ bắt đầu </th>
                <th>Giờ kết thúc </th>
                
              </tr>
            </thead>
            <tbody>
              {filteredShifts.map((shift, index) => (
                <tr key={shift.maCa}>
                  <td>{index + 1}</td>
                  <td>{shift.maCa}</td>
                  <td>{shift.tenCa}</td>
                  <td>{shift.gioBatDau}</td>
                  <td>{shift.gioKetThuc}</td>
                  
                  <td>
                    <button onClick={() => handleEdit(shift)}>Sửa</button> 
                    <button onClick={() => handleDelete(shift.maCa)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
     

      
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false} 
      >
        {editingShiftData ? ( 
          <EditShiftModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            ShiftData={editingShiftData} 
          />
        ) : (
         <AddShiftModal
         isOpen={isModalOpen}
            closeModal={closeModal}
            
         />
        )}
      </Modal>
    </div>
  );
}

export default WeddingShifts;
