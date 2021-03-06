import * as React from "react";
//we use that syntax to import the default export from the module.... Took me a while to find the syntax
import SweetAlert from 'react-bootstrap-sweetalert'
import * as StyleConstants from '../../../Core/Constants/StyleConstants';
import { MessageType } from "../../../Core/Enums";

export interface AdaptableBlotterPopupAlertProps extends React.ClassAttributes<AdaptableBlotterPopupAlert> {
    ShowPopup: boolean
    onClose: Function
    Msg: string
    Header: string
    MessageType: MessageType
}

export class AdaptableBlotterPopupAlert extends React.Component<AdaptableBlotterPopupAlertProps, {}> {

    render() {


        let style: string;
        let isInfo: boolean = false
        let isWarning: boolean = false
        let isError: boolean = false
        switch (this.props.MessageType) {
            case MessageType.Info:
                style = "success"
                isInfo=true
                break;
            case MessageType.Warning:
                style = "warning"
                isWarning=true;
                break;
            case MessageType.Error:
                style = "danger"
                isError= true;
                break;
        }

        return this.props.ShowPopup && <div className={StyleConstants.POPUP_ALERT}>
            <SweetAlert
                danger={isError}
                warning={isWarning}
                success={isInfo}
                confirmBtnBsStyle={style}
                title={this.props.Header}
                onConfirm={() => this.props.onClose()}
            >
                <p>
                    {this.props.Msg.split("\n").map(function (item, index) {
                        return (
                            <span key={index}>
                                {item}
                                <br />
                            </span>
                        )
                    })}
                </p>
            </SweetAlert>
        </div>
    }

}