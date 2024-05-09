import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWeddingService, updateWeddingService, deleteWeddingService } from "../redux/actions/action";
import Modal from 'react-modal';
import EditServiceModal from '../components/EditServiceModal'; 
import AddServiceModal from "../components/AddServiceModal";

function WeddingServices() {
  const dispatch = useDispatch();
  const weddingServices = useSelector((state) => state.weddingServices);
  console.log(weddingServices)
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [editingServiceData, setEditingServiceData] = useState(null);
  const handleEdit = (service) => {
    setEditingServiceData(service);
    setIsModalOpen(true); 
  };
  
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const handleDelete = (madichvu) => {
    dispatch(deleteWeddingService(madichvu)); 
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingServiceData(null); 
  };
  useEffect(() => {
    setFilteredServices(
      weddingServices.filter(
        (Service) =>
          Service.tendichvu.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Service.madichvu.toString().includes(searchTerm) 
          
      )
    );
  }, [searchTerm, weddingServices]);

  return (
    <div className="category-container">
      <h2>Wedding Services</h2>
      <div className="search-bar">
        <input
        className="search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredServices.length > 0 && (
        <div className="list-category">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã dịch vụ</th>
                <th>Tên dịch vụ </th>
               
                <th>Đơn Giá</th>
              
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service, index) => (
                <tr key={service.madichvu}>
                  <td>{index + 1}</td>
                  <td>{service.madichvu}</td>
                  <td>{service.tendichvu}</td>
                 
                  <td>{service.dongia}</td>
                  
                  <td>
                    <button onClick={() => handleEdit(service)}>Sửa</button> 
                    <button onClick={() => handleDelete(service.madichvu)}>Xóa</button>
                  </td>
                </tr>
                
              ))}
            </tbody>
          </table>
          <button onClick={handleAdd}>Thêm mới </button>
        </div>
      )}
       <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
      >
        {editingServiceData ? ( 
          <EditServiceModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            serviceData={editingServiceData} 
          />
        ) : (
         <AddServiceModal
         
            closeModal={closeModal}
            
         />
        )}
      </Modal>
      
    </div>
  );
}

export default WeddingServices;
