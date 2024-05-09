// Trong file reducers/formReducer.js
import { UPDATE_FORM_ERRORS } from "../actions/actionType";

const initialState = {
  
  formErrors: {}, // Các lỗi của form
  // Các state khác...
};

const formReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_FORM_ERRORS:
      return {
        ...state,
        formErrors: action.payload,
      };
    // Các cases khác...
    default:
      return state;
  }
};

export default formReducer;
