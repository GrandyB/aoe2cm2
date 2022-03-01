import * as React from "react";
import {Trans, WithTranslation, withTranslation} from "react-i18next";

interface IProps extends WithTranslation {
    visible: boolean;
    changeNameCallback?: (hostName: string, guestName: string) => void;
}

/* Used by Player.MASTER to set the names of both host and guest. */
class ModalDouble extends React.Component<IProps, object> {

    private readonly INPUT_CAPTAIN_NAME_HOST: string = 'input-captain-name-host';
    private readonly INPUT_CAPTAIN_NAME_GUEST: string = 'input-captain-name-guest';

    public render() {
        if (this.props.visible) {
            return (
                <div id="overlay" className="modal is-active">
                    <div className="modal-background"/>
                    <div id="set-name-message" className="modal-content">
                        <div className="box content">
                            <h3><Trans>doubleModal.header</Trans></h3>
                            <p><Trans>doubleModal.callToAction</Trans></p>
                            <div className="field is-grouped">
                                <div className="field has-addons control">
                                    <div className="control">
                                        <input id={this.INPUT_CAPTAIN_NAME_HOST} type="text"
                                               placeholder='<Trans>rolemodal.role.Host</Trans>'
                                               className="input" defaultValue=""/>
                                    </div>
                                    <span className="versus">vs</span>
                                    <div className="control">
                                        <input id={this.INPUT_CAPTAIN_NAME_GUEST} type="text"
                                               placeholder='<Trans>rolemodal.role.Guest</Trans>'
                                               className="input" defaultValue="" />
                                    </div>
                                </div>
                                <div className="control">
                                    <button className="button is-link" onClick={this.callback}>
                                        <Trans>doubleModal.setNames</Trans>
                                    </button>
                                </div>
                            </div>
                            <p className="has-text-grey-light">
                                <Trans>modal.editInfo</Trans><br/>
                                <Trans>modal.readTheRules</Trans>
                            </p>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (<React.Fragment/>);
        }
    }

    private callback = () => {
        if (this.props.changeNameCallback !== undefined) {
            const hostInput: HTMLInputElement = document.getElementById(this.INPUT_CAPTAIN_NAME_HOST) as HTMLInputElement;
            const guestInput: HTMLInputElement = document.getElementById(this.INPUT_CAPTAIN_NAME_GUEST) as HTMLInputElement;
            const hostName: string = hostInput.value.trim();
            const guestName: string = guestInput.value.trim();
            if (hostName !== '' && guestName !== '') {
                this.props.changeNameCallback(hostName, guestName);
            }
            if (hostName === '') {
                hostInput.classList.add('is-danger');
            }
            if (guestName === '') {
                guestInput.classList.add('is-danger');
            }
        }
    }
}

export default withTranslation()(ModalDouble);
