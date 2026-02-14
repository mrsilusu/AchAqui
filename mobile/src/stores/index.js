import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// Importar reducers (a criar)
const authReducer = (state = { user: null, token: null }, action) => {
  switch(action.type) {
    case 'LOGIN':
      return { user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { user: null, token: null };
    default:
      return state;
  }
};

const servicesReducer = (state = { services: [], loading: false }, action) => {
  switch(action.type) {
    case 'FETCH_SERVICES':
      return { ...state, services: action.payload, loading: false };
    case 'LOADING':
      return { ...state, loading: true };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  auth: authReducer,
  services: servicesReducer
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger)
);

export default store;
