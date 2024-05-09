import { ADD_WEDDING_SHIFT, UPDATE_WEDDING_SHIFT, DELETE_WEDDING_SHIFT } from '../actions/actionType';

const initialState = JSON.parse(localStorage.getItem('weddingShifts')) || [];

const weddingShiftReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WEDDING_SHIFT:
      return [...state, action.payload];
    case UPDATE_WEDDING_SHIFT:
      return state.map(shift =>
        shift.maCa === action.payload.maCa ? action.payload : shift
      );
    case DELETE_WEDDING_SHIFT:
      return state.filter(shift => shift.maCa !== action.payload);
    default:
      return state;
  }
};

export default weddingShiftReducer;
