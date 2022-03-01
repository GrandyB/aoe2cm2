import {IModalState} from "../types";
import {ModalAction} from "../actions";
import {Actions} from "../constants";

export const initialModalState: IModalState = {
    showModal: false,
    showDoubleNameModal: false,
    showRoleModal: false
};

export const modalReducer = (state: IModalState = initialModalState, action: ModalAction) => {
    switch (action.type) {
        case Actions.SHOW_NAME_MODAL:
            console.log(Actions.SHOW_NAME_MODAL);
            return {
                ...state,
                showModal: true
            };
        case Actions.SHOW_DOUBLE_NAME_MODAL:
            console.log(Actions.SHOW_DOUBLE_NAME_MODAL);
            return {
                ...state,
                showDoubleNameModal: true
            };
        case Actions.SHOW_ROLE_MODAL:
            console.log(Actions.SHOW_ROLE_MODAL);
            return {
                ...state,
                showRoleModal: true
            };
        case Actions.SET_PLAYER_NAMES:
            console.log(Actions.SET_PLAYER_NAMES, action);
            return {...state, showDoubleNameModal: action.guestName === null || action.hostName === null};
        case Actions.SET_OWN_NAME:
            console.log(Actions.SET_OWN_NAME, action);
            return {...state, showModal: action.value === null};
        case Actions.SET_OWN_ROLE:
            console.log(Actions.SET_OWN_ROLE, action);
            return {...state, showRoleModal: action.value === null};
    }
    return state;
};