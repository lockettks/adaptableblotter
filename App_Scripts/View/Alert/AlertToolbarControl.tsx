﻿import * as React from "react";
import * as Redux from 'redux'
import { connect } from 'react-redux';
import { Label, Overlay, Fade, Well, FormControl } from 'react-bootstrap';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as AlertRedux from '../../Redux/ActionsReducers/AlertRedux'
import * as DashboardRedux from '../../Redux/ActionsReducers/DashboardRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import { ToolbarStrategyViewPopupProps } from '../Components/SharedProps/ToolbarStrategyViewPopupProps'
import { PanelDashboard } from '../Components/Panels/PanelDashboard';
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyGlyphs from '../../Core/Constants/StrategyGlyphs'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as ScreenPopups from '../../Core/Constants/ScreenPopups'
import { IAlertDefinition } from "../../Core/Api/Interface/AdaptableBlotterObjects";
import { IAlert } from "../../Core/Interface/IMessage";
import { AdaptablePopover } from "../AdaptablePopover";
import { MessageType } from "../../Core/Enums";
import { AlertsPanel } from "../Components/AlertsPanel";

interface AlertToolbarControlProps extends ToolbarStrategyViewPopupProps<AlertToolbarControlComponent> {
    AlertDefinitions: IAlertDefinition[];
    Alerts: IAlert[];
    onDeleteAlert: (index: number) => AlertRedux.AlertDeleteAction;
    onDeleteAllAlert: () => AlertRedux.AlertDeleteAllAction;
}

interface AlertToolbarState {
    ShowMessage: boolean
    Alerts: IAlert[]
}

class AlertToolbarControlComponent extends React.Component<AlertToolbarControlProps, AlertToolbarState> {

    constructor(props: AlertToolbarControlProps) {
        super(props);
        this.state = {
            ShowMessage: false,
            Alerts: this.props.Alerts
        }
    }

    componentDidUpdate() {
        if (this.state.Alerts.length != this.props.Alerts.length) {
            this.setState({ ShowMessage: true, Alerts: this.props.Alerts })
        }
    }

    render() {
        let cssClassName: string = this.props.cssClassName + "__Alert";

        let alertsPanel =
            <AlertsPanel
                cssClassName={cssClassName}
                Alerts={this.props.Alerts}
                ShowPanel={true}
                ShowHeader={false}
                onClearAlert={this.props.onDeleteAlert}
                onRender={() => this.setState({ ShowMessage: false })}
                onClearAllAlerts={this.props.onDeleteAllAlert}
            />

        let collapsedText = this.props.Alerts.length == 0 ?
            "No Alerts" :
            this.props.Alerts.length == 1 ?
                "1 Alert" :
                this.props.Alerts.length + " Alerts";


        let content = <span>

            <FormControl bsSize="small" style={{ width: "80px" }} value={collapsedText} disabled={true} type="string" />
            {' '}
            {this.state.ShowMessage &&
                <Label bsStyle="success">New</Label>
            }
            {' '}
            {this.props.Alerts.length > 0 &&
                <span style={{ marginLeft: "3px" }}>
                    <AdaptablePopover cssClassName={cssClassName} headerText="" tooltipText="Alerts" bodyText={[alertsPanel]} MessageType={this.getMessageType()} useButton={true} triggerAction={"click"} />
                </span>
            }
        </span>


        return <PanelDashboard cssClassName={cssClassName} headerText={StrategyNames.AlertStrategyName} glyphicon={StrategyGlyphs.AlertGlyph} onClose={() => this.props.onClose(StrategyIds.AlertStrategyId)} onConfigure={() => this.props.onConfigure(this.props.IsReadOnly)}>
            {content}
        </PanelDashboard>
    }


    private getMessageType(): MessageType {
        if (this.props.Alerts.find(a => a.MessageType == MessageType.Error) != null) {
            return MessageType.Error;
        }
        if (this.props.Alerts.find(a => a.MessageType == MessageType.Warning) != null) {
            return MessageType.Warning;
        }
        return MessageType.Info;
    }

}


function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        AlertDefinitions: state.Alert.AlertDefinitions,
        Alerts: state.Alert.Alerts,
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onDeleteAlert: (index: number) => dispatch(AlertRedux.AlertDelete(index)),
        onDeleteAllAlert: () => dispatch(AlertRedux.AlertDeleteAll()),
        onClose: (dashboardControl: string) => dispatch(DashboardRedux.DashboardHideToolbar(dashboardControl)),
        onConfigure: (isReadOnly: boolean) => dispatch(PopupRedux.PopupShow(ScreenPopups.AlertPopup, isReadOnly))
    };
}

export let AlertToolbarControl = connect(mapStateToProps, mapDispatchToProps)(AlertToolbarControlComponent);
