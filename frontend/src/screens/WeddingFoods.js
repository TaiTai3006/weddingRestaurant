import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addWeddingFood,
  updateWeddingFood,
  deleteWeddingFood,
} from "../redux/actions/action";
import Modal from "react-modal";
import EditFoodModal from "../components/EditFoodModal";
import AddFoodModal from "../components/AddFoodModal";
import img from "../../src/images/myudon.jpg";
import { IoIosCheckboxOutline } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { VscLockSmall } from "react-icons/vsc";
import { formatCurrency } from "../utils";
import { MdAdd } from "react-icons/md";

function WeddingFoods() {
  const dispatch = useDispatch();
  const weddingFoods = useSelector((state) => state.weddingFoods);
  const foodTypes = useSelector((state) => state.foodTypes);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openOrder, setOpenOrder] = useState(null);
  const [editingFoodData, setEditingFoodData] = useState(null);
  const findFoodType = (maloaimonan) => {
    return foodTypes.find((type) => type.maloaimonan === maloaimonan);
  };
  const handleEdit = (food) => {
    setEditingFoodData(food);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const handleDelete = (mamonan) => {
    dispatch(deleteWeddingFood(mamonan));
  };
  const toggleAccordion = (orderId) => {
    console.log(orderId);
    setOpenOrder(openOrder === orderId ? null : orderId);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFoodData(null);
  };
  useEffect(() => {
    setFilteredFoods(
      weddingFoods.filter(
        (food) =>
          food.tenmonan.toLowerCase().includes(searchTerm.toLowerCase()) ||
          food.mamonan.toString().includes(searchTerm)
        // ||
        // food.loaiMonAn.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, weddingFoods]);

  return (
    <div className="category-container">
      <div className="category-header">
      <h2>Wedding Foods</h2>
      <div className="category-header__right">
      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <button className="new-btn"onClick={handleAdd}>Thêm </button>
      </div>
      
      </div>
      
      {filteredFoods.length > 0 && (
        <div className="food-table">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mã Món Ăn</th>
                <th>Tên Món Ăn</th>
                <th>Loại Món Ăn</th>
                <th>Đơn Giá</th>
                <th>Mô Tả</th>
              </tr>
            </thead>
            <tbody>
              {filteredFoods.map((food, index) => (
                <React.Fragment key={food.matieccuoi}>
                  <tr
                    key={food.mamonan}
                    onClick={() => toggleAccordion(food.mamonan)}
                  >
                    <td>{index + 1}</td>
                    <td>{food.mamonan}</td>
                    <td>{food.tenmonan}</td>
                    <td>{findFoodType(food.maloaimonan)?.tenloaimonan}</td>
                    <td>{food.dongia}</td>
                    <td>{food.ghichu}</td>
                  </tr>
                  {openOrder === food.mamonan && (
                    <tr className="accordion-tr">
                      <td colSpan="12" className={openOrder === food.mamonan ? "accordion-border" : ""}>
                        <div className="accordion-container">
                          <p className="food-name">{food.tenmonan}</p>
                          <div className="accordion-content">
                            <div className="food-img">
                              {food.img ? (
                                <img
                                  className="food image"
                                  src={food.img}
                                  alt="food image"
                                />
                              ) : (
                                <img
                                  className="food image"
                                  src={img} // Here you need to specify the default image source
                                  alt="food image"
                                />
                              )}
                            </div>

                            <div className="food-desc">
                              <div className="description">
                                <p className="desc-text ">
                                  Mã món ăn : {food.mamonan}
                                </p>
                                <p className="desc-text">
                                  Tên món ăn : {food.tenmonan}
                                </p>
                                <p className="desc-text">
                                  {" "}
                                  Loại món ăn : {findFoodType(food.maloaimonan)?.tenloaimonan}
                                </p>
                                <p className="desc-text">
                                  {" "}
                                  Đơn giá :{" "}
                                  {formatCurrency(parseFloat(food.dongia))}
                                </p>
                              </div>
                              <div>
                                <p className="desc-text ">
                                  Ghi chú : {food.ghichu}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="btn-group">
                            <button
                              onClick={() => handleEdit(food)}
                              className="update-btn"
                            >
                              <span className="icon-btn">
                                <IoIosCheckboxOutline />{" "}
                              </span>
                              <span>Cập nhật</span>{" "}
                            </button>
                            <button className="stop-btn">
                              <span className="icon-btn">
                                <VscLockSmall />
                              </span>
                              Ngừng kinh doanh
                            </button>
                            <button className="delete-btn">
                              <span className="icon-btn">
                                <MdOutlineDeleteOutline />
                              </span>{" "}
                              Xóa
                            </button>
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
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        className="add-modal"
      >
        {editingFoodData ? (
          <EditFoodModal
            isOpen={isModalOpen}
            closeModal={closeModal}
            foodData={editingFoodData}
          />
        ) : (
          <AddFoodModal closeModal={closeModal} />
        )}
      </Modal>
    </div>
  );
}

export default WeddingFoods;
