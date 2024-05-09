// Trong actions/actionCreators.js
import axios from 'axios';
import { addWeddingFood } from "./action";
import { addFoodType ,addWeddingHall,addWeddingService,addHallType} from './action';


const token = '810a608d6e0d12f96e565716c85407a08dc098bc';
const apiUrl = 'http://127.0.0.1:8000/foods/';
const apiUrlFoodTypes = 'http://127.0.0.1:8000/foodTypes/';
const apiUrlHalls = 'http://127.0.0.1:8000/lobbies/';
const apiUrlService = 'http://127.0.0.1:8000/services/';
const apiUrlLobbyTypes = 'http://127.0.0.1:8000/lobbyTypes/';

const fetchWeddingFoods = () => {
  return async dispatch => {
    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      // Dispatch action để cập nhật state với dữ liệu fetch từ API
      response.data.forEach(food => {
        dispatch(addWeddingFood(food));
      });
    } catch (error) {
      console.error('Error fetching wedding foods:', error);
    }
  };
};
const fetchWeddingServices = () => {
  return async dispatch => {
    try {
      const response = await axios.get(apiUrlService, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      // Dispatch action để cập nhật state với dữ liệu fetch từ API
      response.data.forEach(service => {
        dispatch(addWeddingService(service));
      });
    } catch (error) {
      console.error('Error fetching wedding services:', error);
    }
  };
};

const fetchFoodTypes = () => {
  return async dispatch => {
    try {
        const response = await axios.get(apiUrlFoodTypes, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        response.data.forEach(food => {
            dispatch(addFoodType(food));
          });
        } catch (error) {
          console.error('Error fetching wedding foods:', error);
        
    }
  };
};

const fetchHallTypes = () => {
  return async dispatch => {
    try {
        const response = await axios.get(apiUrlLobbyTypes, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        response.data.forEach(hall => {
            dispatch(addHallType(hall));
          });
        } catch (error) {
          console.error('Error fetching wedding hall type:', error);
        
    }
  };
};

const fetchHalls = () => {
  return async dispatch => {
    try {
        const response = await axios.get(apiUrlHalls, {
          headers: {
            Authorization: `Token ${token}`
          }
        });
        response.data.forEach(hall => {
            dispatch(addWeddingHall(hall));
          });
        } catch (error) {
          console.error('Error fetching wedding halls:', error);
        
    }
  };
};
// const fetchShifts = () => {
//   return async dispatch => {
//     try {
//         const response = await axios.get(apiUrlShifts, {
//           headers: {
//             Authorization: `Token ${token}`
//           }
//         });
//         response.data.forEach(shift => {
//             dispatch(addWeddingShift(shift));
//           });
//         } catch (error) {
//           console.error('Error fetching wedding shifts:', error);
        
//     }
//   };
// };



export { fetchWeddingFoods,fetchFoodTypes,fetchHalls,fetchWeddingServices,fetchHallTypes}; 
