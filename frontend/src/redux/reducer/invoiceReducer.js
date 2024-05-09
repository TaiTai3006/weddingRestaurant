// Trong file reducers.js
import { ADD_INVOICE } from "../actions/actionType";

// const initialState = JSON.parse(localStorage.getItem('invoices')) || [
//     {
//       matieccuoi: "MTC001",
//       ngaydat: "2024-04-10",
//       ngaydaitiec: "2024-05-20",
//       soluongban: 10,
//       soluongbandutru: 2,
//       dongiaban: 500000,
//       tongtienban: 5000000,
//       tongtiendichvu: 1000000,
//       tongtiendattiec: 6000000,
//       tiendatcoc: 3000000,
//       conlai: 3000000,
//       tencodau: "Cô Dâu A",
//       tenchure: "Chú Rể A",
//       sdt: "987654321",
//       tinhtrangphancong: "Hoàn thành",
//       maca: "CA001",
//       masanh: "SA001",
//       username: "user001",
//       danhsachmonan: [
//         {
//           maMonAn: "MA001",
//           tenMonAn: "bánh cuốn",
//           donGia: 150,
//           soluong: 1,
//         },
//         {
//           maMonAn: "MA002",
//           tenMonAn: "bánh trang",
//           donGia: 150,
//           soluong: 1,
//         },
//       ],
  
//       danhsachdichvu: [
//         {
//           maDichVu: "DV001",
//           tenDichVu: "Trang trí",
//           soluong: 1,
//           donGia: 1500,
//         },
//       ],
//     },
//     {
//       matieccuoi: "MTC002",
//       ngaydat: "2024-04-10",
//       ngaydaitiec: "2024-05-20",
//       soluongban: 10,
//       soluongbandutru: 2,
//       dongiaban: 500000,
//       tongtienban: 5000000,
//       tongtiendichvu: 1000000,
//       tongtiendattiec: 6000000,
//       tiendatcoc: 3000000,
//       conlai: 3000000,
//       tencodau: "Cô Dâu A",
//       tenchure: "Chú Rể C",
//       sdt: "987654321",
//       tinhtrangphancong: "Hoàn thành",
//       maca: "CA002",
//       masanh: "SA002",
//       username: "user001",
//       danhsachmonan: [
//         {
//           maMonAn: "MA001",
//           tenMonAn: "bánh cuốn",
//           donGia: 150,
//           soluong: 1,
//         },
//         {
//           maMonAn: "MA002",
//           tenMonAn: "bánh trang",
//           donGia: 150,
//           soluong: 1,
//         },
//       ],
  
//       danhsachdichvu: [
//         {
//           maDichVu: "DV001",
//           tenDichVu: "Trang trí",
//           soluong: 1,
//           donGia: 1500,
//         },
//       ],
//     },
//     {
//       matieccuoi: "MTC004",
//       ngaydat: "2024-04-20",
//       ngaydaitiec: "2024-05-20",
//       soluongban: 10,
//       soluongbandutru: 2,
//       dongiaban: 500000,
//       tongtienban: 5000000,
//       tongtiendichvu: 1000000,
//       tongtiendattiec: 6000000,
//       tiendatcoc: 3000000,
//       conlai: 3000000,
//       tencodau: "Cô Dâu A",
//       tenchure: "Chú Rể B",
//       sdt: "987654321",
//       tinhtrangphancong: "Hoàn thành",
//       maca: "CA003",
//       masanh: "SA003",
//       username: "user001",
//       danhsachmonan: [
//         {
//           maMonAn: "MA001",
//           tenMonAn: "bánh cuốn",
//           donGia: 150,
//           soluong: 1,
//         },
//         {
//           maMonAn: "MA002",
//           tenMonAn: "bánh trang",
//           donGia: 150,
//           soluong: 1,
//         },
//       ],
  
//       danhsachdichvu: [
//         {
//           maDichVu: "DV001",
//           tenDichVu: "Trang trí",
//           soluong: 1,
//           donGia: 1500,
//         },
//       ],
//     },
//   ];;
const initialState = [
      {
        matieccuoi: "MTC001",
        ngaydat: "2024-04-10",
        ngaydaitiec: "2024-05-20",
        soluongban: 10,
        soluongbandutru: 2,
        dongiaban: 500000,
        tongtienban: 5000000,
        tongtiendichvu: 1000000,
        tongtiendattiec: 6000000,
        tiendatcoc: 3000000,
        conlai: 3000000,
        tencodau: "Cô Dâu A",
        tenchure: "Chú Rể A",
        sdt: "987654321",
        tinhtrangphancong: "Hoàn thành",
        maca: "CA001",
        masanh: "SA001",
        username: "user001",
        danhsachmonan: [
          {
            maMonAn: "MA001",
            tenMonAn: "bánh cuốn",
            donGia: 150,
            soluong: 1,
          },
          {
            maMonAn: "MA002",
            tenMonAn: "bánh trang",
            donGia: 150,
            soluong: 1,
          },
        ],
    
        danhsachdichvu: [
          {
            maDichVu: "DV001",
            tenDichVu: "Trang trí",
            soluong: 1,
            donGia: 1500,
          },
        ],
      },
      {
        matieccuoi: "MTC002",
        ngaydat: "2024-04-10",
        ngaydaitiec: "2024-05-20",
        soluongban: 10,
        soluongbandutru: 2,
        dongiaban: 500000,
        tongtienban: 5000000,
        tongtiendichvu: 1000000,
        tongtiendattiec: 6000000,
        tiendatcoc: 3000000,
        conlai: 3000000,
        tencodau: "Cô Dâu A",
        tenchure: "Chú Rể C",
        sdt: "987654321",
        tinhtrangphancong: "Hoàn thành",
        maca: "CA001",
        masanh: "SA002",
        username: "user001",
        danhsachmonan: [
          {
            maMonAn: "MA001",
            tenMonAn: "bánh cuốn",
            donGia: 150,
            soluong: 1,
          },
          {
            maMonAn: "MA002",
            tenMonAn: "bánh trang",
            donGia: 150,
            soluong: 1,
          },
        ],
    
        danhsachdichvu: [
          {
            maDichVu: "DV001",
            tenDichVu: "Trang trí",
            soluong: 1,
            donGia: 1500,
          },
        ],
      },
      {
        matieccuoi: "MTC004",
        ngaydat: "2024-04-20",
        ngaydaitiec: "2024-05-20",
        soluongban: 10,
        soluongbandutru: 2,
        dongiaban: 500000,
        tongtienban: 5000000,
        tongtiendichvu: 1000000,
        tongtiendattiec: 6000000,
        tiendatcoc: 3000000,
        conlai: 3000000,
        tencodau: "Cô Dâu A",
        tenchure: "Chú Rể B",
        sdt: "987654321",
        tinhtrangphancong: "Hoàn thành",
        maca: "CA001",
        masanh: "SA003",
        username: "user001",
        danhsachmonan: [
          {
            maMonAn: "MA001",
            tenMonAn: "bánh cuốn",
            donGia: 150,
            soluong: 1,
          },
          {
            maMonAn: "MA002",
            tenMonAn: "bánh trang",
            donGia: 150,
            soluong: 1,
          },
        ],
    
        danhsachdichvu: [
          {
            maDichVu: "DV001",
            tenDichVu: "Trang trí",
            soluong: 1,
            donGia: 1500,
          },
        ],
      },
    ];
const invoiceReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_INVOICE:
        return [
            ...state,
            action.payload 
          ];
    default:
      return state;
  }
};

export default invoiceReducer;
