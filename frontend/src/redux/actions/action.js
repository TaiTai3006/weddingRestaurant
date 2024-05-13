import { GET_HALL_AVAILABLE, UPDATE_FORM_DATA } from "./actionType";
import { ADD_INVOICE } from "./actionType";
import {
  ADD_WEDDING_HALL,
  UPDATE_WEDDING_HALL,
  DELETE_WEDDING_HALL,
} from "./actionType";
import {
  ADD_WEDDING_FOOD,
  UPDATE_WEDDING_FOOD,
  DELETE_WEDDING_FOOD,
} from "./actionType";
import {
  ADD_WEDDING_SERVICE,
  UPDATE_WEDDING_SERVICE,
  DELETE_WEDDING_SERVICE,
} from "./actionType";
import {
  ADD_WEDDING_SHIFT,
  UPDATE_WEDDING_SHIFT,
  DELETE_WEDDING_SHIFT,
} from "./actionType";
import { ADD_FOOD_TYPE, ADD_HALL_TYPE } from './actionType';
import { UPDATE_FORM_ERRORS } from "./actionType";
export const updateFormData = (formData) => ({
  type: UPDATE_FORM_DATA,
  payload: formData,
});

export const addInvoice = (formData) => {
  return {
    type: ADD_INVOICE,
    payload: formData,
  };
};

export const addWeddingHall = (hall) => {
  return {
    type: ADD_WEDDING_HALL,
    payload: hall,
  };
};

export const updateWeddingHall = (hall) => {
  return {
    type: UPDATE_WEDDING_HALL,
    payload: hall,
  };
};

export const deleteWeddingHall = (hallId) => {
  return {
    type: DELETE_WEDDING_HALL,
    payload: hallId,
  };
};
export const addWeddingFood = (food) => {
  return {
    type: ADD_WEDDING_FOOD,
    payload: food,
  };
};

export const updateWeddingFood = (food) => {
  return {
    type: UPDATE_WEDDING_FOOD,
    payload: food,
  };
};

export const deleteWeddingFood = (foodId) => {
  return {
    type: DELETE_WEDDING_FOOD,
    payload: foodId,
  };
};
export const addWeddingService = (service) => {
  return {
    type: ADD_WEDDING_SERVICE,
    payload: service,
  };
};

export const updateWeddingService = (service) => {
  return {
    type: UPDATE_WEDDING_SERVICE,
    payload: service,
  };
};

export const deleteWeddingService = (serviceId) => {
  return {
    type: DELETE_WEDDING_SERVICE,
    payload: serviceId,
  };
};
export const addWeddingShift = (shift) => {
  return {
    type: ADD_WEDDING_SHIFT,
    payload: shift,
  };
};

export const updateWeddingShift = (shift) => {
  return {
    type: UPDATE_WEDDING_SHIFT,
    payload: shift,
  };
};

export const deleteWeddingShift = (shiftId) => {
  return {
    type: DELETE_WEDDING_SHIFT,
    payload: shiftId,
  };
};


export const updateFormErrors = (errors) => {
  return {
    type: UPDATE_FORM_ERRORS,
    payload: errors,
  };
};


export const addFoodType = (foodType) => {
  return {
    type: ADD_FOOD_TYPE,
    payload: foodType
  };
};
export const addHallType = (hallType) => {
  return {
    type: ADD_HALL_TYPE,
    payload: hallType
  };
};

export const getHallAvaibale = (data) =>{
  return{
    type: GET_HALL_AVAILABLE,
    payload: data
  }
}