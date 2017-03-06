/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import * as DashboardRedux from '../../Redux/ActionsReducers/DashboardRedux'
import { Panel, Form, FormControl, ControlLabel, FormGroup, Col, Row, Checkbox } from 'react-bootstrap';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import { IStrategyViewPopupProps } from '../../Core/Interface/IStrategyView'
import { PanelWithImage } from '../PanelWithImage';
import { IDashboardControl } from '../../Core/Interface/IDashboardStrategy';

interface DashboardConfigProps extends IStrategyViewPopupProps<DashboardConfigComponent> {
    DashboardControls: Array<IDashboardControl>;
    onChangeControlVisibility: (ControlName: string, IsVisible: boolean) => DashboardRedux.DashboardChangeControlVisibilityAction
}

class DashboardConfigComponent extends React.Component<DashboardConfigProps, {}> {
    render() {

        let radioDashboardControls = this.props.DashboardControls.map((x, i) => {
            return <Col xs={9} key={i} style={toolbarMarginStyle}>
                <Checkbox key={x.Name} inline onChange={(e) => this.onDashboardControlVisibilityChanged(e, x)} checked={x.IsVisible}>Show {x.Name} Control</Checkbox>
            </Col>
        })


        return (
            <PanelWithImage header="Blotter Dashboard" bsStyle="primary" glyphicon="dashboard">

                <Panel header="Dashboard Controls" bsStyle="info">
                    {radioDashboardControls}

                </Panel>

            </PanelWithImage>
        );
    }

    onDashboardControlVisibilityChanged(event: React.FormEvent, dashboardControl: IDashboardControl) {
        let e = event.target as HTMLInputElement;
        this.props.onChangeControlVisibility(dashboardControl.Name, e.checked);
    }

}
function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        DashboardControls: state.Dashboard.DashboardControls,
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onChangeControlVisibility: (controlName: string, isVisible: boolean) => dispatch(DashboardRedux.ChangeVisibilityDashboardControl(controlName, isVisible))
    };
}

export let DashboardConfig = connect(mapStateToProps, mapDispatchToProps)(DashboardConfigComponent);

let toolbarMarginStyle = {
    margin: '10px'
}