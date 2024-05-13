// Trong store.js
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk'; // Import named export "thunk"
import bookingReducer, { weddingHallAvailable } from './reducer/bookingReducer'; 
import formDataReducer from './reducer/formDataReducer';
import invoiceReducer from './reducer/invoiceReducer';
import weddingHallReducer from './reducer/hallsReducer';
import weddingFoodsReducer from './reducer/foodsReducer';
import weddingServicesReducer from './reducer/servicesReducer';
import weddingShiftReducer from './reducer/shiftsReducer';
import formReducer from './reducer/formReducer';
import { fetchWeddingFoods ,fetchFoodTypes,fetchHalls,fetchWeddingServices,fetchHallTypes} from './actions/actionCreators';
import foodTypesReducer from './reducer/foodTypesReducer';
import hallTypesReducer from './reducer/hallTypesReducer';
import { getHallAvaibale } from './actions/action';


const rootReducer = combineReducers({
  // booking: bookingReducer,
  formData: formDataReducer,
  invoices: invoiceReducer,
  weddingHalls: weddingHallReducer,
  weddingFoods: weddingFoodsReducer,
  weddingServices: weddingServicesReducer,
  weddingShifts: weddingShiftReducer,
  formErrors: formReducer,
  foodTypes: foodTypesReducer,
  hallTypes : hallTypesReducer,
  hallAvailable : weddingHallAvailable,
});


const store = createStore(rootReducer, applyMiddleware(thunk));

// Dispatch hàm action creator fetchWeddingFoods để lấy dữ liệu từ API khi Redux store được tạo
// store.dispatch(fetchWeddingFoods());
// store.dispatch(fetchFoodTypes());
// store.dispatch(fetchHalls());
// store.dispatch(fetchWeddingServices());
// store.dispatch(fetchHallTypes());

// console.log(store)

export default store;
