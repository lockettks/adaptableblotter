﻿import * as React from "react";
import * as Redux from 'redux'
import { connect } from 'react-redux';
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import * as DashboardRedux from '../../Redux/ActionsReducers/DashboardRedux'
import * as SelectedCellsRedux from '../../Redux/ActionsReducers/SelectedCellsRedux'
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyGlyphs from '../../Core/Constants/StrategyGlyphs'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as ScreenPopups from '../../Core/Constants/ScreenPopups'
import { ToolbarStrategyViewPopupProps } from "../Components/SharedProps/ToolbarStrategyViewPopupProps";
import { IAdaptableBlotter } from "../../Core/Interface/IAdaptableBlotter";
import { PanelDashboard } from "../Components/Panels/PanelDashboard";
import { AdaptableBlotterState } from "../../Redux/Store/Interface/IAdaptableStore";
import { ISelectedCellInfo, ISelectedCellSummmary } from "../../Strategy/Interface/ISelectedCellsStrategy";
import { SelectedCellOperation } from "../../Core/Enums";
import { DropdownButton, MenuItem, InputGroup, ControlLabel } from "react-bootstrap";
import { EnumExtensions } from "../../Core/Extensions/EnumExtensions";
import * as GeneralConstants from '../../Core/Constants/GeneralConstants'

interface SelectedCellsToolbarControlComponentProps extends ToolbarStrategyViewPopupProps<SelectedCellsToolbarControlComponent> {
    SelectedCellInfo: ISelectedCellInfo
    SelectedCellOperation: SelectedCellOperation
    onSelectedCellsOperationChange: (SelectedCellOperation: SelectedCellOperation) => SelectedCellsRedux.SelectedCellsChangeOperationAction;
    onSelectedCellsCreateSummary: () => SelectedCellsRedux.SelectedCellsCreateSummaryAction;
    SelectedCellSummary: ISelectedCellSummmary
}

interface SelectedCellsToolbarControlComponentState {
    SubFunc: any
}

class SelectedCellsToolbarControlComponent extends React.Component<SelectedCellsToolbarControlComponentProps, SelectedCellsToolbarControlComponentState> {
    constructor(props: SelectedCellsToolbarControlComponentProps) {
        super(props);
        this.state = {
            SubFunc: (sender: IAdaptableBlotter, event: IAdaptableBlotter) => {
                this.onSelectionChanged()
            }
        }
    }
    public componentDidMount() {
        if (this.props.AdaptableBlotter) {
            this.props.AdaptableBlotter.onSelectedCellsChanged().Subscribe(this.state.SubFunc)
        }
    }

    public componentWillUnmount() {
        if (this.props.AdaptableBlotter) {
            this.props.AdaptableBlotter.onSelectedCellsChanged().Unsubscribe(this.state.SubFunc)
        }
    }


    render() {

        let cssClassName: string = this.props.cssClassName + "__SelectedCells";

        let operationMenuItems = EnumExtensions.getNames(SelectedCellOperation).map((selectedCellOperation: SelectedCellOperation, index) => {
            return <MenuItem key={index} eventKey="index" onClick={() => this.props.onSelectedCellsOperationChange(selectedCellOperation)}>{selectedCellOperation as SelectedCellOperation}</MenuItem>
        })

        let content = <span>
            <div className={this.props.IsReadOnly ? GeneralConstants.READ_ONLY_STYLE : ""}>
                <InputGroup>
                    <DropdownButton style={{ marginRight: "3px", width: "75px" }} title={this.props.SelectedCellOperation} id="SelectedCells_Operation" bsSize="small" componentClass={InputGroup.Button}>
                        {operationMenuItems}
                    </DropdownButton>
                    {this.props.SelectedCellSummary != null &&
                        <ControlLabel style={{ marginTop: "5px", marginLeft: "3px" }}>{this.getOperationValue()} </ControlLabel>
                    }
                </InputGroup>


            </div>
        </span>

        return <PanelDashboard cssClassName={cssClassName} headerText={StrategyNames.SelectedCellsStrategyName} glyphicon={StrategyGlyphs.SelectedCellsGlyph} onClose={() => this.props.onClose(StrategyIds.SelectedCellsStrategyId)} onConfigure={() => this.props.onConfigure(this.props.IsReadOnly)}>
            {content}

        </PanelDashboard>
    }




    private onSelectionChanged(): void {
        this.props.onSelectedCellsCreateSummary();

        //     this.setState({ SelectedCellSummmary: selectedCellSummary } as SelectedCellsToolbarControlComponentState);
    }

    private getOperationValue(): any {
        switch (this.props.SelectedCellOperation) {
            case SelectedCellOperation.Sum:
                return this.props.SelectedCellSummary.Sum;
            case SelectedCellOperation.Average:
                return this.props.SelectedCellSummary.Average;
            case SelectedCellOperation.Mode:
                return this.props.SelectedCellSummary.Mode;
            case SelectedCellOperation.Median:
                return this.props.SelectedCellSummary.Median;
            case SelectedCellOperation.Max:
                return this.props.SelectedCellSummary.Max;
            case SelectedCellOperation.Min:
                return this.props.SelectedCellSummary.Min;
            case SelectedCellOperation.Distinct:
                return this.props.SelectedCellSummary.Distinct;
            case SelectedCellOperation.Count:
                return this.props.SelectedCellSummary.Count;
            case SelectedCellOperation.Only:
                return this.props.SelectedCellSummary.Only;
            case SelectedCellOperation.VWAP:
                return this.props.SelectedCellSummary.VWAP;
        }
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        SelectedCellInfo: state.Grid.SelectedCellInfo,
        SelectedCellOperation: state.SelectedCells.SelectedCellOperation,
        SelectedCellSummary: state.SelectedCells.SelectedCellSummary
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onSelectedCellsOperationChange: (SelectedCellOperation: SelectedCellOperation) => dispatch(SelectedCellsRedux.SelectedCellsChangeOperation(SelectedCellOperation)),
        onSelectedCellsCreateSummary: () => dispatch(SelectedCellsRedux.SelectedCellCreateSummary()),
        onClose: (dashboardControl: string) => dispatch(DashboardRedux.DashboardHideToolbar(dashboardControl)),
        onConfigure: (isReadOnly: boolean) => dispatch(PopupRedux.PopupShow(ScreenPopups.SelectedCellsPopup, isReadOnly))
    };
}

export let SelectedCellsToolbarControl = connect(mapStateToProps, mapDispatchToProps)(SelectedCellsToolbarControlComponent);
