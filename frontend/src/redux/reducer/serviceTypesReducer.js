import { ADD_SERVICE_TYPE } from '../actions/actionType';

const initialState = [];

const serviceTypesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SERVICE_TYPE:
      return [...state, action.payload];
    default:
      return state;
  }
};

export default serviceTypesReducer;
