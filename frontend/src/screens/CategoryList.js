import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addWeddingHall } from "../redux/actions/action";
import "../style/category.css";

function CategoryList() {
  return (
    <div className="category-container">
      <h2>Danh sách danh mục</h2>
      <div className="list-category">
        <div className="list-column">
          <a href="/weddinghalls" className="category-item">
            <p className="category-name">Danh sách các sảnh </p>
            <p className="category-desc"> Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
          <a href="/weddingshifts" className="category-item">
            <p className="category-name">Danh sách các ca </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
          <a href="/weddingfoods" className="category-item">
            <p className="category-name">Danh sách các món ăn  </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
        </div>
        <div className="list-column">
          <a href="/weddingservices" className="category-item">
            <p className="category-name">Danh sách các dịch vụ  </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
          <a href="/weddinghalls" className="category-item">
            <p className="category-name">Danh sách các sảnh </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
          <a href="/weddinghalls" className="category-item">
            <p className="category-name">Danh sách các sảnh </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
        </div>
      
        <div className="list-column">
          <a href="/weddinghalls" className="category-item">
            <p className="category-name">Danh sách các sảnh </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
          <a href="/weddinghalls" className="category-item">
            <p className="category-name">Danh sách các sảnh </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
          <a href="/weddinghalls" className="category-item">
            <p className="category-name">Danh sách các sảnh </p>
            <p className="category-desc">Chỉnh sửa thông tin các sảnh (thêm, xóa, chỉnh sửa,vv..)</p>
          </a>
        </div>

       
      </div>
    </div>
  );
}

export default CategoryList;
