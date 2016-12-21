/// <reference path="../../typings/index.d.ts" />

import * as React from "react";
import * as Redux from "redux";
import { Helper } from '../Core/Helper'
import { SortOrder, ColumnType } from '../Core/Enums'
import { ListBoxFilterSortComponent } from './ListBoxFilterSortComponent'
import { ListGroupItem, Row, ListGroup, Col, Button, ListGroupItemProps, Panel, Grid, Glyphicon, ButtonGroup, ListGroupProps, Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';


interface SingleListBoxProps extends ListGroupProps {
    Values: Array<any>
    UiSelectedValues: Array<any>
    onSelectedChange: (SelectedValues: Array<any>) => void
    ValuesDataType: ColumnType // need to change name of this enum
    //if not primitive objects both DisplayMember and ValueMember need to be used
    DisplayMember?: string
    ValueMember?: string
}

interface SingleListBoxState extends React.ClassAttributes<SingleListBox> {
    Values: Array<any>
    UiSelectedValues: Array<any>
    FilterValue: string
    SortOrder: SortOrder
}

export class SingleListBox extends React.Component<SingleListBoxProps, SingleListBoxState> {
    constructor(props: SingleListBoxProps) {
        super(props);
        let availableValues = new Array<any>();
        this.props.Values.forEach(x => {
            if (this.props.ValueMember) {
                if (this.props.Values.findIndex(y => y[this.props.ValueMember] == x[this.props.ValueMember]) < 0) {
                    availableValues.push(x);
                }
            }
            else {
                if (this.props.Values.indexOf(x) < 0) {
                    availableValues.push(x);
                }
            }
        })
        availableValues.sort()
        this.state = {
            Values: this.props.Values,
            UiSelectedValues: this.props.UiSelectedValues,
            FilterValue: "",
            SortOrder: SortOrder.Ascending
        };
    }
    componentWillReceiveProps(nextProps: SingleListBoxProps, nextContext: any) {
        //we need to rebuild the list of UI Selected items in case we are managing non primitive objects as we compare stuff on instance rather than properties
        let uiSelectedValues: Array<any>
        if (nextProps.ValueMember) {
            uiSelectedValues = []
            this.state.UiSelectedValues.forEach(x => {
                let item = nextProps.Values.find(y => y[nextProps.ValueMember] == x[nextProps.ValueMember])
                if (item) {
                    uiSelectedValues.push(item)
                }
            })
        }
        else {
            uiSelectedValues = nextProps.UiSelectedValues
        }
        this.setState({
            Values: Helper.sortArray(this.state.SortOrder, nextProps.Values, this.props.ValuesDataType),
            UiSelectedValues: uiSelectedValues,
            FilterValue: this.state.FilterValue,
            SortOrder: this.state.SortOrder
        });
    }
    render() {
        let itemsElements = this.state.Values.map(x => {
            let isActive = this.state.UiSelectedValues.indexOf(x) >= 0;
            let display: string = this.props.DisplayMember ? x[this.props.DisplayMember] : x;
            let value = this.props.ValueMember ? x[this.props.ValueMember] : x;
            if (this.state.FilterValue != "" && display.toLocaleLowerCase().indexOf(this.state.FilterValue.toLocaleLowerCase()) < 0) {
                return null;
            }
            else {
                return <ListGroupItem key={value}
                    onClick={() => this.onClickItem(x)}
                    active={isActive}
                    value={value} >{display}</ListGroupItem>
            }
        })

        let header = <ListBoxFilterSortComponent FilterValue={this.state.FilterValue} sortColumnValues={() => this.sortColumnValues()}
            SortOrder={this.state.SortOrder} handleChangeFilterValue={(e) => this.handleChangeFilterValue(e)}></ListBoxFilterSortComponent>
        
        return <div>
            {header}
            <ListGroup fill style={this.props.style}>
                {itemsElements}
            </ListGroup>
        </div>;
    }

    handleChangeFilterValue(x: string) {
        this.setState({
            FilterValue: x
        } as SingleListBoxState);
    }

    sortColumnValues() {
        if (this.state.SortOrder == SortOrder.Ascending) {
            this.setState({
                Values: Helper.sortArray(SortOrder.Descending, this.state.Values, this.props.ValuesDataType),
                SortOrder: SortOrder.Descending
            } as SingleListBoxState);
        }
        else {
            this.setState({
                Values: Helper.sortArray(SortOrder.Ascending, this.state.Values, this.props.ValuesDataType),
                SortOrder: SortOrder.Ascending
            } as SingleListBoxState);
        }
    }

    raiseOnChange() {
        this.props.onSelectedChange(this.state.UiSelectedValues);
    }

    onClickItem(item: any) {
        let index = this.state.UiSelectedValues.indexOf(item);
        if (index >= 0) {
            let newArray = [...this.state.UiSelectedValues];
            newArray.splice(index, 1);
            this.setState({ UiSelectedValues: newArray } as SingleListBoxState, () => this.raiseOnChange())
        }
        else {
            let newArray = [...this.state.UiSelectedValues];
            newArray.push(item)
            //we reorder the array so UiSelectedValues hass the same order as the list displayed on screen
            newArray.sort((a, b) => (this.state.Values.indexOf(a) < this.state.Values.indexOf(b)) ? -1 : (this.state.Values.indexOf(a) > this.state.Values.indexOf(b)) ? 1 : 0)
            this.setState({ UiSelectedValues: newArray } as SingleListBoxState, () => this.raiseOnChange())
        }
    }
}