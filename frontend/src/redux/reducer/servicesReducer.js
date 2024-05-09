import { ADD_WEDDING_SERVICE, UPDATE_WEDDING_SERVICE, DELETE_WEDDING_SERVICE } from "../actions/actionType";

const initialState = JSON.parse(localStorage.getItem('weddingServices')) || [
];

const weddingServicesReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_WEDDING_SERVICE:
            return [...state, action.payload];
        case UPDATE_WEDDING_SERVICE:
            return state.map(service =>
                service.maDichVu === action.payload.maDichVu ? action.payload :service
            );
        case DELETE_WEDDING_SERVICE:
            return state.filter(service => service.maDichVu !== action.payload);
        default:
            return state;
    }
};

export default weddingServicesReducer;
