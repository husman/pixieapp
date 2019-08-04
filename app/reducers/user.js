/**
 * Copyright 2019 Neetos LLC. All rights reserved.
 */
const initialState = {
  firstName: process.env.FIRSTNAME || '',
  lastName: process.env.LASTNAME || '',
};

export default function chat(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
