import { ADD_HALL_TYPE } from '../actions/actionType';

const initialState = [];

const hallTypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_HALL_TYPE:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default hallTypesReducer;
