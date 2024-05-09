import { ADD_WEDDING_HALL, UPDATE_WEDDING_HALL, DELETE_WEDDING_HALL } from '../actions/actionType';
const initialState = []

const weddingHallReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WEDDING_HALL:
      return [...state, action.payload];
    case UPDATE_WEDDING_HALL:
      return state.map(hall =>
        hall.maSanh === action.payload.maSanh ? action.payload : hall
      );
    case DELETE_WEDDING_HALL:
      return state.filter(hall => hall.maSanh !== action.payload);
    default:
      return state;
  }
};

export default weddingHallReducer;
