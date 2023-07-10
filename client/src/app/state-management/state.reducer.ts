import { createReducer, on } from "@ngrx/store";
import { login, logout } from "./state.actions";
import { State } from "../models/state";

let localState = localStorage.getItem("state");
export const initialState: State | null = localState === null ? new State() : JSON.parse(localState) as State;

export const stateReducer = createReducer(
    initialState,
    on(login, (state, action) => {
        let newState: State = {
            ...state,
            user: action.state.user,
            accessToken: action.state.accessToken,
            refreshToken: action.state.refreshToken
        } as State;
        localStorage.setItem("state", JSON.stringify(newState));
        return newState;
    }),
    on(logout, (state) => {
        localStorage.clear();
        return new State();
    })
);