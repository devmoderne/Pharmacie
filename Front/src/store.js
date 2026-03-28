// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import comptabiliteReducer from './features/comptabiliteSlice';
// importe d'autres reducers ici si tu en as d'autres

const store = configureStore({
  reducer: {
    comptabilite: comptabiliteReducer,
    // ajoute d'autres reducers ici
  },
});

export default store;
