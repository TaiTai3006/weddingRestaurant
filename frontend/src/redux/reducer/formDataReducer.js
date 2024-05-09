// formDataReducer.js
import { UPDATE_FORM_DATA } from '../actions/actionType'

const initialState = {
    matieccuoi: "",
    ngaydat: "",
    ngaydaitiec: "",
    soluongban: 0,
    soluongbandutru: 0,
    dongiaban: 0,
    tongtienban: 0,
    tongtiendichvu: 0,
    tongtiendattiec: 0,
    tiendatcoc: 0,
    conlai: 0,
    tencodau: "",
    tenchure: "",
    sdt: "",
    tinhtrangphancong: null,
    maca: "",
    masanh: "",
    username: "",
    danhsachmonan:[],
    danhsachdichvu:[]
};

const formDataReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FORM_DATA:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default formDataReducer;
