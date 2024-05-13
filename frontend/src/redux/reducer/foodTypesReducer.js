// reducer/foodTypesReducer.js
import { ADD_FOOD_TYPE } from '../actions/actionType';

const initialState = [];

const foodTypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FOOD_TYPE:
      return action.payload;
    default:
      return state;
  }
};

export default foodTypesReducer;
