// Trong reducers/foodReducer.js
import { ADD_WEDDING_FOOD, UPDATE_WEDDING_FOOD, DELETE_WEDDING_FOOD } from '../actions/actionType';

const initialState = [];

const foodReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_WEDDING_FOOD:
      return action.payload
    case UPDATE_WEDDING_FOOD:
      return state.map(food =>
        food.mamonan === action.payload.mamonan ? action.payload : food
      );
    case DELETE_WEDDING_FOOD:
      return state.filter(food => food.mamonan !== action.payload);
    default:
      return state;
  }
};

export default foodReducer;
