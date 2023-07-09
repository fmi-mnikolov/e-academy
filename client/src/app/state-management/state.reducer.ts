import { createReducer, on } from "@ngrx/store";
import { login, logout } from "./state.actions";
import { State } from "../models/state";

export const initialState = new State();

export const stateReducer = createReducer(
    initialState,
    on(login, (state) => {
        return state;
    }),
    on(logout, (state) => {
        return new State();
    })
);