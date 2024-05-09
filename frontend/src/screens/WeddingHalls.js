import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWeddingHall,
  updateWeddingHall,
  deleteWeddingHall,
} from "../redux/actions/action";
import Modal from "react-modal";
import EditHallModal from "../components/EditHallModal";
import AddHallModal from "../components/AddHallModal";

function WeddingHalls() {
  const dispatch = useDispatch();
  const weddingHalls = useSelector((state) => state.weddingHalls);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHalls, setFilteredHalls] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHallData, setEditingHallData] = useState(null);

  useEffect(() => {
    setFilteredHalls(
      weddingHalls.filter(
        (hall) =>
          hall.tensanh.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hall.masanh.toString().includes(searchTerm)
      )
    );
  }, [searchTerm, weddingHalls]);

  const handleDelete = (masanh) => {
    dispatch(deleteWeddingHall(masanh));
  };
  const handleEdit = (hall) => {
    setEditingHallData(hall);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHallData(null);
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

        <button className="add_btn" onClick={handleAdd}>
          Thêm mới sảnh
        </button>
      </div>

      {filteredHalls.length > 0 && (
        <div className="list-category">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Sảnh</th>
                <th>Tên Sảnh</th>
                <th>Số Lượng Bàn Tối Đa</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredHalls.map((hall, index) => (
                <tr key={hall.masanh}>
                  <td>{index + 1}</td>
                  <td>{hall.masanh}</td>
                  <td>{hall.tensanh}</td>
                  <td>{hall.soluongbantoida}</td>
                  <td>
                    <button onClick={() => handleEdit(hall)}>Sửa</button>
                    <button onClick={() => handleDelete(hall.masanh)}>
                      Xóa
                    </button>
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
        ariaHideApp={false} // Disable ariaHideApp warning
      >
        {editingHallData ? (
          <EditHallModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            hallData={editingHallData}
          />
        ) : (
          <AddHallModal isOpen={isModalOpen} closeModal={closeModal} />
        )}
      </Modal>
    </div>
  );
}

export default WeddingHalls;
