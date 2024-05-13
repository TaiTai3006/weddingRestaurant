import { GET_HALL_AVAILABLE } from "../actions/actionType";

export const weddingHallAvailable = (state = [], action) => {
    switch (action.type) {
      case GET_HALL_AVAILABLE:
        return action.payload;
      default:
        return state;
    }
  };