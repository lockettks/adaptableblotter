/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import { Button, Form, FormControl, Col, Panel, ListGroup, Row, Well } from 'react-bootstrap';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import { IStrategyViewPopupProps } from '../../Core/Interface/IStrategyView'
import { ICellValidationRule, ICellValidationStrategy } from '../../Core/interface/ICellValidationStrategy';
import { IColumn } from '../../Core/Interface/IAdaptableBlotter';
import * as StrategyIds from '../../Core/StrategyIds'
import * as CellValidationRedux from '../../Redux/ActionsReducers/CellValidationRedux'
import { Helper } from '../../Core/Helper';
import { ColumnType } from '../../Core/Enums';
import { PanelWithButton } from '../PanelWithButton';
import { EntityListActionButtons } from '../EntityListActionButtons';
import { PopupType, CellValidationAction } from '../../Core/Enums'
import { IStrategy } from '../../Core/Interface/IStrategy';
import { PanelWithRow } from '../PanelWithRow';
import { AdaptableWizard } from './../Wizard/AdaptableWizard'
import { CellValidationSettingsWizard } from './CellValidationSettingsWizard'
import { CellValidationExpressionWizard } from './CellValidationExpressionWizard'
import { CellValidationRulesWizard } from './CellValidationRulesWizard'
import { StringExtensions, EnumExtensions } from '../../Core/Extensions';
import { ExpressionHelper } from '../../Core/Expression/ExpressionHelper';


interface CellValidationConfigProps extends IStrategyViewPopupProps<CellValidationConfigComponent> {
    CellValidations: ICellValidationRule[];
    Columns: Array<IColumn>
    onDeleteCellValidation: (Index: number) => CellValidationRedux.CellValidationDeleteAction
    onAddEditCellValidation: (Index: number, CellValidation: ICellValidationRule) => CellValidationRedux.CellValidationAddOrUpdateAction
}

interface CellValidationConfigState {
    EditedCellValidation: ICellValidationRule
    EditedIndexCellValidation: number
}

class CellValidationConfigComponent extends React.Component<CellValidationConfigProps, CellValidationConfigState> {
    constructor() {
        super();
        this.state = { EditedCellValidation: null, EditedIndexCellValidation: -1 }
    }
    render() {

        let CellValidationActionTypes = EnumExtensions.getNamesAndValues(CellValidationAction).map((enumNameAndValue: any) => {
            return <option key={enumNameAndValue.value} value={enumNameAndValue.value}>{StringExtensions.PlaceSpaceBetweenCapitalisedWords(enumNameAndValue.name)}</option>
        })


        let cellInfo: [string, number][] = [["Column", 2], ["Validation Rule", 3], ["Expression", 3],["Failure Action", 2], ["", 2]];

        let CellValidationItems = this.props.CellValidations.map((x, index) => {
            return <li
                className="list-group-item" key={index}>
                <Row >
                    <Col xs={2}>
                        {this.props.Columns.find(c=>c.ColumnId == x.ColumnId).FriendlyName }
                    </Col>
                     <Col xs={3}>
                        {x.Description}
                    </Col>
                    <Col xs={3}>
                        {this.setExpressionDescription(x) }
                    </Col>
                    <Col xs={2}>
                        <FormControl componentClass="select" placeholder="select" value={x.CellValidationAction.toString()} onChange={(x) => this.onCellValidationActionChanged(index, x)} >
                            {CellValidationActionTypes}
                        </FormControl>

                    </Col>
                    <Col xs={2}>
                        <EntityListActionButtons
                            deleteClick={() => this.props.onDeleteCellValidation(index)}
                            editClick={() => this.onEdit(index, x)}>
                        </EntityListActionButtons>
                    </Col>
                </Row>
            </li>
        })
        return <PanelWithButton headerText="Cell Validation Configuration" bsStyle="primary" style={panelStyle}
            buttonContent={"Create Cell Validation Rule"}
            buttonClick={() => this.createCellValidation()} 
            glyphicon={"flag"} >
            {CellValidationItems.length > 0 &&
                <div>
                    <PanelWithRow CellInfo={cellInfo} bsStyle="info" />
                    <ListGroup style={listGroupStyle}>
                        {CellValidationItems}
                    </ListGroup>
                </div>
            }

            {CellValidationItems.length == 0 &&
                <Well bsSize="small">Click 'Create Cell Validation Rule' to start creating rules for valid cell edits.\nEdits that fail can be prevented altogether or allowed after user sees a warning.</Well>
            }

            {this.state.EditedCellValidation != null &&
                <AdaptableWizard Steps={[
                    <CellValidationSettingsWizard Columns={this.props.Columns} Blotter={this.props.AdaptableBlotter} />,
                    <CellValidationRulesWizard Columns={this.props.Columns} Blotter={this.props.AdaptableBlotter} />,
                    <CellValidationExpressionWizard ColumnList={this.props.Columns} Blotter={this.props.AdaptableBlotter} SelectedColumnId={null} />,
                ]}
                    Data={this.state.EditedCellValidation}
                    StepStartIndex={0}
                    onHide={() => this.closeWizard()}
                    onFinish={() => this.finishWizard()} ></AdaptableWizard>}

        </PanelWithButton>
    }

    createCellValidation() {
        let CellValidationStrategy: ICellValidationStrategy = this.props.AdaptableBlotter.Strategies.get(StrategyIds.CellValidationStrategyId) as ICellValidationStrategy;
        this.setState({ EditedCellValidation: CellValidationStrategy.CreateEmptyCellValidation(), EditedIndexCellValidation: -1 });
    }

    onEdit(index: number, CellValidation: ICellValidationRule) {
        //we clone the condition as we do not want to mutate the redux state here....
        this.setState({ EditedCellValidation: Helper.cloneObject(CellValidation), EditedIndexCellValidation: index });
    }

    private onCellValidationActionChanged(index: number, event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        let CellValidation: ICellValidationRule = this.props.CellValidations[index];
        CellValidation.CellValidationAction = Number.parseInt(e.value);
        this.props.onAddEditCellValidation(index, CellValidation);
    }

    closeWizard() {
        this.setState({ EditedCellValidation: null, EditedIndexCellValidation: -1 });
    }

    finishWizard() {
        this.props.onAddEditCellValidation(this.state.EditedIndexCellValidation, this.state.EditedCellValidation);
        this.setState({ EditedCellValidation: null, EditedIndexCellValidation: -1 });
    }

     setExpressionDescription(CellValidation: ICellValidationRule):string {
        return (CellValidation.HasExpression) ?
            ExpressionHelper.ConvertExpressionToString(CellValidation.OtherExpression, this.props.Columns, this.props.AdaptableBlotter) :
            "No Expression";
    }


}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        Columns: state.Grid.Columns,
        CellValidations: state.CellValidation.CellValidations
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onDeleteCellValidation: (index: number) => dispatch(CellValidationRedux.DeleteCellValidation(index)),
        onAddEditCellValidation: (index: number, CellValidation: ICellValidationRule) => dispatch(CellValidationRedux.AddEditCellValidation(index, CellValidation))
    };
}

export let CellValidationConfig = connect(mapStateToProps, mapDispatchToProps)(CellValidationConfigComponent);

let listGroupStyle = {
    overflowY: 'auto',
    minHeight: '100px',
    maxHeight: '300px'
};

let panelStyle = {
    width: '800px'
}

