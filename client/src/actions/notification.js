export const setNotification = (data) => {
  return {
    type: "SET_NOTIFICATION",
    payload: data,
  };
};

export const removeNotification = (timestamp) => {
  return {
    type: "REMOVE_NOTIFICATION",
    payload: timestamp,
  };
};
