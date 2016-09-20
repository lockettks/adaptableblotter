import {IShortcut} from '../../Core/Interface/IShortcutStrategy';
/// <reference path="../../typings/index.d.ts" />

import * as React from "react";
import * as Redux from "redux";
import { Provider, connect } from 'react-redux';
import {ControlLabel, FormGroup, Button, Form, Col, Panel, ListGroup, Row, Modal, MenuItem, SplitButton, Checkbox} from 'react-bootstrap';

import {AdaptableBlotterState} from '../../Redux/Store/Interface/IAdaptableStore'
import * as ShortcutRedux from '../../Redux/ActionsReducers/ShortcutRedux'
import {IStrategyViewPopupProps} from '../../Core/Interface/IStrategyView'
import {IColumn} from '../../Core/Interface/IAdaptableBlotter';
import {ColumnType} from '../../Core/Enums'
import {ShortcutAction} from '../../Core/Enums'
import {ShortcutConfigItem} from './ShortcutConfigItem'
import {ShortcutConfigHeader} from './ShortcutConfigItem'

import {AdaptableWizard} from './../Wizard/AdaptableWizard'
import {ShortcutColumnTypeWizard} from './ShortcutColumnTypeWizard'
import {ShortcutKeyWizard} from './ShortcutKeyWizard'
import {ShortcutResultWizard} from './ShortcutResultWizard'


interface ShortcutConfigProps extends IStrategyViewPopupProps<ShortcutConfigComponent> {
    onAddShortcut: (shortcut: IShortcut) => ShortcutRedux.ShortcutAddAction
    onDeleteShortcut: (shortcut: IShortcut) => ShortcutRedux.ShortcutDeleteAction
    onEditShortcut: (shortcut: IShortcut) => ShortcutRedux.ShortcutEditAction
    onSelectShortcut: (shortcut: IShortcut) => ShortcutRedux.ShortcutSelectAction
    NumericShortcuts: Array<IShortcut>,
    DateShortcuts: Array<IShortcut>,
}

interface ShortcutConfigInternalState {
    isEditing: boolean;
    WizardStartIndex: number
}

class ShortcutConfigComponent extends React.Component<ShortcutConfigProps, ShortcutConfigInternalState> {

    testColumnTypes: Array<ColumnType>;
    constructor() {
        super();
        this.state = { isEditing: false, WizardStartIndex: 0 }
    }

    render() {
         
        let sortedNumericShortcut = this.props.NumericShortcuts.sort((a, b) => (a.ShortcutKey < b.ShortcutKey) ? -1 : (a.ShortcutKey > b.ShortcutKey) ? 1 : 0)
        let numericShortcuts = sortedNumericShortcut.map((shortcut: IShortcut) => {
            let availableNumericKeys = keys.filter(x => this.props.NumericShortcuts.findIndex(y => y.ShortcutKey == x) == -1).concat(shortcut.ShortcutKey).sort()
            return <ShortcutConfigItem Shortcut={shortcut} key={"Numeric"+shortcut.ShortcutKey}
                AvailableKeys={availableNumericKeys}
                onSelect={(shortcut) => this.props.onSelectShortcut(shortcut) }
                onEdit={(shortcut) => this.onEditShortcut(shortcut) }
                onDelete={(shortcut) => this.props.onDeleteShortcut(shortcut) }
                onEdited={(shortcut)=> this.props.onEditShortcut(shortcut)}>
            </ShortcutConfigItem>
        });
        let sortedDateShortcut = this.props.DateShortcuts.sort((a, b) => (a.ShortcutKey < b.ShortcutKey) ? -1 : (a.ShortcutKey > b.ShortcutKey) ? 1 : 0)
        let dateShortcuts = sortedDateShortcut.map((shortcut: IShortcut) => {
            let availableDateKeys = keys.filter(x => this.props.DateShortcuts.findIndex(y => y.ShortcutKey == x) == -1).concat(shortcut.ShortcutKey).sort()
            return <ShortcutConfigItem Shortcut={shortcut} key={"Date"+shortcut.ShortcutKey}
            AvailableKeys={availableDateKeys}
                onSelect={(shortcut) => this.props.onSelectShortcut(shortcut) }
                onEdit={(shortcut) => this.onEditShortcut(shortcut) }
                onDelete={(shortcut) => this.props.onDeleteShortcut(shortcut) }
                onEdited={(shortcut)=> this.props.onEditShortcut(shortcut)}>
            </ShortcutConfigItem>
        });
        let header = <Form horizontal>
            <Row style={{display: "flex", alignItems: "center"}}>
                <Col xs={9}>Shortcuts</Col>
                <Col xs={3}>
                    <Button onClick={() => this.CreateShortcut() }> Create Shortcut</Button>
                </Col>
            </Row>
        </Form>;

        return <Panel header={header} bsStyle="primary" style={panelStyle}>
            <ShortcutConfigHeader/>
            <ListGroup style={divStyle}>
                {numericShortcuts}
                {dateShortcuts}
            </ListGroup>

            {this.state.isEditing ?
                <AdaptableWizard Steps={
                    [
                        <ShortcutColumnTypeWizard  />,
                        <ShortcutKeyWizard DateKeysAvailable={this._editedShortcut.ShortcutKey ?
                            keys.filter(x => this.props.DateShortcuts.findIndex(y => y.ShortcutKey == x) == -1).concat(this._editedShortcut.ShortcutKey).sort()
                            : keys.filter(x => this.props.DateShortcuts.findIndex(y => y.ShortcutKey == x) == -1) }
                            NumericKeysAvailable={this._editedShortcut.ShortcutKey ?
                                keys.filter(x => this.props.NumericShortcuts.findIndex(y => y.ShortcutKey == x) == -1).concat(this._editedShortcut.ShortcutKey).sort()
                                : keys.filter(x => this.props.NumericShortcuts.findIndex(y => y.ShortcutKey == x) == -1) }/>,
                        <ShortcutResultWizard  />
                    ]}
                    Data={this._editedShortcut}
                    StepStartIndex={this.state.WizardStartIndex}
                    onHide={() => this.closeWizard() }
                    onFinish={() => this.WizardFinish() } ></AdaptableWizard> : null}
        </Panel>
    }

    private _editedShortcut: IShortcut;

    closeWizard() {
        this.setState({ isEditing: false, WizardStartIndex: 0 });
    }
    WizardFinish() {
        if (this._editedShortcut.ColumnType == ColumnType.Number) {
            if (this.props.NumericShortcuts.find(x => x.ShortcutKey == this._editedShortcut.ShortcutKey)) {
                this.props.onEditShortcut(this._editedShortcut)
            }
            else {
                this.props.onAddShortcut(this._editedShortcut)
            }
        }
        else if (this._editedShortcut.ColumnType == ColumnType.Date) {
            if (this.props.DateShortcuts.find(x => x.ShortcutKey == this._editedShortcut.ShortcutKey)) {
                this.props.onEditShortcut(this._editedShortcut)
            }
            else {
                this.props.onAddShortcut(this._editedShortcut)
            }
        }

        this.setState({ isEditing: false, WizardStartIndex: 0 }, () => { this._editedShortcut = null; });
    }

    private onEditShortcut(shortcut: IShortcut) {
        this._editedShortcut = shortcut;
        this.setState({ isEditing: true, WizardStartIndex: 1 });
    }

    CreateShortcut() {
        this._editedShortcut = { ShortcutKey: null, ShortcutResult: null, ColumnType: ColumnType.Number, ShortcutAction: ShortcutAction.Multiply, IsLive: true, IsPredefined: false, IsDynamic: false };
        this.setState({ isEditing: true, WizardStartIndex: 0 });
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        NumericShortcuts: state.Shortcut.NumericShortcuts,
        DateShortcuts: state.Shortcut.DateShortcuts,
        AdaptableBlotter: ownProps.AdaptableBlotter
    };
}

// Which action creators does it want to receive by props?
function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onSelectShortcut: (shortcut: IShortcut) => dispatch(ShortcutRedux.SelectShortcut(shortcut)),
        onAddShortcut: (shortcut: IShortcut) => dispatch(ShortcutRedux.AddShortcut(shortcut)),
        onDeleteShortcut: (shortcut: IShortcut) => dispatch(ShortcutRedux.DeleteShortcut(shortcut)),
        onEditShortcut: (shortcut: IShortcut) => dispatch(ShortcutRedux.EditShortcut(shortcut))
    };
}

export let ShortcutConfig = connect(mapStateToProps, mapDispatchToProps)(ShortcutConfigComponent);

let panelStyle = {
    width: '800px'
}

const keys = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]

let divStyle = {
    'overflowY': 'auto',
    'maxHeight': '300px'
}