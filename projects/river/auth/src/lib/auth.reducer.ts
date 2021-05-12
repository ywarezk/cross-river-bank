import { createReducer, on } from '@ngrx/store';
import { setFirstName } from './auth.actions';

export const userReducer = createReducer(
  {
    firstName: 'Yariv',
    lastName: 'Katz'
  },
  on(setFirstName, (state, action) => ({...state, firstName: action.firstName}))
)
