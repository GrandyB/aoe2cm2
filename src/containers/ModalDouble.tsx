import {ApplicationState} from '../types';
import {connect} from 'react-redux';
import {Dispatch} from "redux";
import * as actions from "../actions";
import ModalDouble from '../components/menu/ModalDouble';

export function mapStateToProps(state: ApplicationState) {
    return {
        visible: state.modal.showDoubleNameModal
    };
}

export function mapDispatchToProps(dispatch: Dispatch<actions.Action>, ownProps: any) {
    console.log('ownProps', ownProps);
    const changeNameCallback = (hostName: string, guestName: string) => {
        // Send to server and to itself/client
        dispatch(actions.setPlayerNames(hostName, guestName));
        dispatch(actions.changePlayerNames(hostName, guestName));

        // Tell server that Master is ready
        dispatch(actions.sendReady());
    }
    return {
        changeNameCallback
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDouble);
