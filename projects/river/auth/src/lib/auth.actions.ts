import { createAction, props } from '@ngrx/store';

export const setFirstName = createAction(
  '[auth] setFirstName',
  props<{firstName: string}>()
)
