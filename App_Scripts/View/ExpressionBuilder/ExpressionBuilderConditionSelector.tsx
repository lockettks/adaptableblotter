import * as React from "react";
import { IRange } from '../../Core/Interface/IRange'
import { IUserFilter, ISystemFilter } from '../../Strategy/Interface/IUserFilterStrategy'
import { PanelWithButton } from '../Components/Panels/PanelWithButton'
import { IColumn } from '../../Core/Interface/IColumn';
import { ExpressionBuilderColumnValues } from './ExpressionBuilderColumnValues'
import { ExpressionBuilderUserFilter } from './ExpressionBuilderUserFilter'
import { ExpressionBuilderRanges } from './ExpressionBuilderRanges'
import { Well, FormGroup, ControlLabel, Row, Col, HelpBlock, Tabs, Tab, Panel, NavItem, Nav } from 'react-bootstrap';
import { Expression } from '../../Core/Expression';
import { ExpressionHelper } from '../../Core/Helpers/ExpressionHelper';
import { FilterHelper } from '../../Core/Helpers/FilterHelper';
import { DataType, ExpressionMode, DistinctCriteriaPairValue, SelectionMode, QueryBuildStatus } from '../../Core/Enums'
import { StringExtensions } from '../../Core/Extensions/StringExtensions'
import { ButtonNew } from '../Components/Buttons/ButtonNew';
import { IRawValueDisplayValuePair } from "../UIInterfaces";
import { ColumnSelector } from "../Components/Selectors/ColumnSelector";
import { AdaptableBlotterForm } from "../Components/Forms/AdaptableBlotterForm";
import { ButtonCondition } from "../Components/Buttons/ButtonCondition";

export interface ExpressionBuilderConditionSelectorProps extends React.ClassAttributes<ExpressionBuilderConditionSelector> {
    ColumnsList: Array<IColumn>
    Expression: Expression
    ExpressionMode: ExpressionMode
    onExpressionChange: (Expression: Expression) => void
    onSelectedColumnChange: (ColumnName: string) => void
    getColumnValueDisplayValuePairDistinctList: (columnId: string, distinctCriteria: DistinctCriteriaPairValue) => Array<IRawValueDisplayValuePair>
    UserFilters: IUserFilter[]
    SystemFilters: ISystemFilter[]
    SelectedColumnId: string
    QueryBuildStatus: QueryBuildStatus
}

export interface ExpressionBuilderConditionSelectorState {
    ColumnValues: Array<any>
    SelectedColumnValues: Array<any>
    AllFilterExpresions: Array<string>
    SelectedFilterExpressions: Array<string>
    SelectedColumnRanges: Array<IRange>
    QueryBuildStatus: QueryBuildStatus
}

export class ExpressionBuilderConditionSelector extends React.Component<ExpressionBuilderConditionSelectorProps, ExpressionBuilderConditionSelectorState> {
    constructor(props: ExpressionBuilderConditionSelectorProps) {
        super(props);
        this.state = this.buildState(this.props)
    }

    componentWillReceiveProps(nextProps: ExpressionBuilderConditionSelectorProps, nextContext: any) {
        this.setState(this.buildState(nextProps))
    }

    private buildState(theProps: ExpressionBuilderConditionSelectorProps): ExpressionBuilderConditionSelectorState {
        if (StringExtensions.IsNullOrEmpty(theProps.SelectedColumnId)) {
            return {
                ColumnValues: [],
                SelectedColumnValues: [],
                AllFilterExpresions: [],
                SelectedFilterExpressions: [],
                SelectedColumnRanges: [],
                QueryBuildStatus: this.props.QueryBuildStatus
            };
        }
        else {
            let selectedColumnValues: Array<any>
            let selectedColumnFilterExpressions: Array<string>
            let selectedColumnRanges: Array<IRange>

            // get column values
            let keyValuePair = theProps.Expression.ColumnDisplayValuesExpressions.find(x => x.ColumnName == theProps.SelectedColumnId)
            if (keyValuePair) {
                selectedColumnValues = keyValuePair.ColumnDisplayValues
            }
            else {
                selectedColumnValues = []
            }

            // get  filter expressions
            let filterExpressions = theProps.Expression.FilterExpressions.find(x => x.ColumnName == theProps.SelectedColumnId)
            selectedColumnFilterExpressions = []
            if (filterExpressions) {
                filterExpressions.Filters.forEach((fe: string) => {
                    // if its a userfilter add it to that list
                    let userFilter: IUserFilter = this.props.UserFilters.find(uf => uf.Name == fe);
                    if (userFilter) {
                        selectedColumnFilterExpressions.push(fe);
                    }
                    // if it is a system filter add it ot that list
                    let systemFilter: ISystemFilter = this.props.SystemFilters.find(sf => sf.Name == fe);
                    if (systemFilter) {
                        selectedColumnFilterExpressions.push(fe);
                    }
                })
            }
            let combinedFilterExpressions: string[] = this.props.UserFilters.map(f => f.Name).concat(...this.props.SystemFilters.map(sf => sf.Name));

            // get ranges
            let ranges = theProps.Expression.RangeExpressions.find(x => x.ColumnName == theProps.SelectedColumnId)
            selectedColumnRanges = (ranges) ? ranges.Ranges : []

            return {
                ColumnValues: this.props.getColumnValueDisplayValuePairDistinctList(theProps.SelectedColumnId, DistinctCriteriaPairValue.DisplayValue),
                SelectedColumnValues: selectedColumnValues,
                AllFilterExpresions: combinedFilterExpressions,
                SelectedFilterExpressions: selectedColumnFilterExpressions,
                SelectedColumnRanges: selectedColumnRanges,
                QueryBuildStatus: this.props.QueryBuildStatus
            };
        }
    }

    render() {
        let column = (StringExtensions.IsNullOrEmpty(this.props.SelectedColumnId)) ? null : this.props.ColumnsList.find(x => x.ColumnId == this.props.SelectedColumnId)
        let selectedColumnDataType: DataType = column ? column.DataType : null
        let selectedColumn: IColumn = column;
        let selectedColumnFriendlyName: string = (selectedColumn) ? selectedColumn.FriendlyName : ""

        // get filter names
        // first system ones
        let availableFilterNames: string[] = []
        FilterHelper.GetSystemFiltersForColumn(selectedColumn, this.props.SystemFilters).forEach((sf: ISystemFilter) => {
            availableFilterNames.push(sf.Name)
        })
        FilterHelper.GetUserFiltersForColumn(selectedColumn, this.props.UserFilters).forEach((uf: IUserFilter) => {
            availableFilterNames.push(uf.Name)
        })


        // get the help descriptions
        let firstTimeText: string = "Start creating the query by selecting a column below."

        let secondTimeText: string = "Select another column for the query."


        let selectedColumnText: string = "Build the Query: Use the tabs below to add column values, filters or ranges for this column as required."
        if (this.props.ExpressionMode == ExpressionMode.SingleColumn) {
            selectedColumnText += "This Query can only contain one Query Condition."
        }

        let addButtonText: string = "Click to add another 'Column Condition' to the query."

        let panelHeader: string = (this.state.QueryBuildStatus == QueryBuildStatus.SelectColumn) ? "Select a Column" : "Column: " + selectedColumnFriendlyName;

        return <PanelWithButton headerText={panelHeader} bsStyle="info" style={{ height: '425px' }}>


            {this.state.QueryBuildStatus == QueryBuildStatus.SelectColumn ?
                <div>
                    <Well bsSize="small">
                        <HelpBlock>
                            {firstTimeText}
                        </HelpBlock>
                    </Well>

                    <ColumnSelector SelectedColumnIds={[this.props.SelectedColumnId]}
                        ColumnList={this.props.ColumnsList}
                        onColumnChange={columns => this.onColumnSelectChange(columns)}
                        SelectionMode={SelectionMode.Single} />
                </div>

                :
                <div>
                    {selectedColumn &&
                        <Tab.Container id="left-tabs-example" defaultActiveKey="columnValues">
                            <div>
                                <Nav bsStyle="pills" >
                                    <NavItem eventKey="columnValues" selected={true}>Column Values</NavItem>
                                    <NavItem eventKey="filters">Filters</NavItem>
                                    <NavItem eventKey="ranges">Ranges</NavItem>
                                </Nav>
                                <Tab.Content animation>
                                    <Tab.Pane eventKey="columnValues">
                                        {selectedColumn.DataType != DataType.Boolean &&
                                            <ExpressionBuilderColumnValues
                                                ColumnValues={this.state.ColumnValues}
                                                SelectedValues={this.state.SelectedColumnValues}
                                                onColumnValuesChange={(selectedValues) => this.onSelectedColumnValuesChange(selectedValues)}>
                                            </ExpressionBuilderColumnValues>

                                        }
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="filters">
                                        <ExpressionBuilderUserFilter
                                            AvailableFilterNames={availableFilterNames}
                                            SelectedFilterNames={this.state.SelectedFilterExpressions}
                                            onFilterNameChange={(selectedValues) => this.onSelectedFiltersChanged(selectedValues)} >
                                        </ExpressionBuilderUserFilter>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="ranges">
                                        <ExpressionBuilderRanges
                                            SelectedColumn={selectedColumn}
                                            Ranges={this.state.SelectedColumnRanges}
                                            Columns={this.props.ColumnsList}
                                            onRangesChange={(ranges) => this.onSelectedColumnRangesChange(ranges)} >
                                        </ExpressionBuilderRanges>
                                    </Tab.Pane>
                                </Tab.Content>
                            </div>
                        </Tab.Container>
                    }
                </div>
            }
        </PanelWithButton>
    }



    onSelectedColumnChanged() {
        this.props.onSelectedColumnChange("")
    }

    onSelectedColumnRangesChange(selectedRanges: Array<IRange>) {

        //we assume that we manipulate a cloned object. i.e we are not mutating the state
        let colRangesExpression = this.props.Expression.RangeExpressions
        let rangesCol = colRangesExpression.find(x => x.ColumnName == this.props.SelectedColumnId)
        if (rangesCol) {
            if (selectedRanges.length == 0) {
                let keyValuePairIndex = colRangesExpression.findIndex(x => x.ColumnName == this.props.SelectedColumnId)
                colRangesExpression.splice(keyValuePairIndex, 1)
            }
            else {
                rangesCol.Ranges = selectedRanges
            }
        }
        else {
            colRangesExpression.push({ ColumnName: this.props.SelectedColumnId, Ranges: selectedRanges })
        }
        this.props.onExpressionChange(Object.assign({}, this.props.Expression, { RangeExpressions: colRangesExpression }))
        this.setState({ SelectedColumnRanges: selectedRanges } as ExpressionBuilderConditionSelectorState)
    }

    onSelectedColumnValuesChange(selectedColumnValues: Array<any>) {
        let colValuesExpression = this.props.Expression.ColumnDisplayValuesExpressions
        let valuesCol = colValuesExpression.find(x => x.ColumnName == this.props.SelectedColumnId);
        if (valuesCol) {
            if (selectedColumnValues.length == 0) {
                let keyValuePairIndex = colValuesExpression.findIndex(x => x.ColumnName == this.props.SelectedColumnId)
                colValuesExpression.splice(keyValuePairIndex, 1)
            }
            else {
                valuesCol.ColumnDisplayValues = selectedColumnValues
            }
        }
        else {
            colValuesExpression.push({ ColumnName: this.props.SelectedColumnId, ColumnDisplayValues: selectedColumnValues })
        }
        this.props.onExpressionChange(Object.assign({}, this.props.Expression, { ColumnDisplayValuesExpressions: colValuesExpression }))
        this.setState({ SelectedColumnValues: selectedColumnValues } as ExpressionBuilderConditionSelectorState)
    }

    onSelectedFiltersChanged(selectedFilters: Array<string>) {
        //we assume that we manipulate a cloned object. i.e we are not mutating the state
        let colUserFilterExpression = this.props.Expression.FilterExpressions
        let userFilterExpressionCol = colUserFilterExpression.find(x => x.ColumnName == this.props.SelectedColumnId)
        if (userFilterExpressionCol) {
            if (selectedFilters.length == 0) {
                let keyValuePairIndex = colUserFilterExpression.findIndex(x => x.ColumnName == this.props.SelectedColumnId)
                colUserFilterExpression.splice(keyValuePairIndex, 1)
            }
            else {
                userFilterExpressionCol.Filters = selectedFilters
            }
        }
        else {
            colUserFilterExpression.push({ ColumnName: this.props.SelectedColumnId, Filters: selectedFilters })
        }

        this.props.onExpressionChange(Object.assign({}, this.props.Expression, { FilterExpressions: colUserFilterExpression }))
        this.setState({ SelectedFilterExpressions: selectedFilters } as ExpressionBuilderConditionSelectorState)
    }

    private onColumnSelectChange(columns: IColumn[]) {
        this.props.onSelectedColumnChange(columns.length > 0 ? columns[0].ColumnId : "")
    }


}

let divStyle: React.CSSProperties = {
    'overflowY': 'auto',
    'height': '480px',
    'marginBottom': '0'
}