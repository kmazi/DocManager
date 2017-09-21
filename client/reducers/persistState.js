const persistState = (state = {}, action) => {
  switch (action.type) {
  case 'persist/REHYDRATE':
    return { ...state, ...action.payload };
  default:
    return { state };
  }
};
export default persistState;
