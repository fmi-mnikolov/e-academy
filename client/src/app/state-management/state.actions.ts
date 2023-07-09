import { createAction, props } from "@ngrx/store";
import { State } from "../models/state";

export const login = createAction("[LOGIN]",
    props<{ state: State }>());
export const logout = createAction("[LOGOUT]");