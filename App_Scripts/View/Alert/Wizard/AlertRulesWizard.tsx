import * as React from "react";
import { Radio, FormGroup, FormControl, Col, Panel, HelpBlock } from 'react-bootstrap';
import { IColumn } from '../../../Core/Interface/IColumn';
import { AdaptableWizardStep, AdaptableWizardStepProps } from '../../Wizard/Interface/IAdaptableWizard'
import { DataType, LeafExpressionOperator, MessageType, RangeOperandType } from '../../../Core/Enums';
import { StringExtensions } from '../../../Core/Extensions/StringExtensions';
import { AdaptablePopover } from '../../AdaptablePopover';
import { ExpressionHelper } from "../../../Core/Helpers/ExpressionHelper";
import { AdaptableBlotterForm } from "../../Components/Forms/AdaptableBlotterForm";
import { IAlertDefinition, IRange } from "../../../Core/Api/Interface/AdaptableBlotterObjects";
import { ColumnHelper } from "../../../Core/Helpers/ColumnHelper";

export interface AlertRulesWizardProps extends AdaptableWizardStepProps<IAlertDefinition> {
    Columns: Array<IColumn>
}
export interface AlertSettingsWizardState {
    Operator: LeafExpressionOperator;
    Operand1: string;
    Operand2: string;
}

export class AlertRulesWizard extends React.Component<AlertRulesWizardProps, AlertSettingsWizardState> implements AdaptableWizardStep {
    constructor(props: AlertRulesWizardProps) {
        super(props)
        this.state = {
            Operator: this.props.Data.Range.Operator,
            Operand1: this.props.Data.Range.Operand1,
            Operand2: this.props.Data.Range.Operand2,
        }
    }

    render(): any {

        let operatorTypes = this.getAvailableOperators().map((operator: LeafExpressionOperator) => {
            return <option key={operator} value={operator.toString()}>{ExpressionHelper.OperatorToLongFriendlyString(operator, this.getColumnDataTypeFromState())}</option>
        })

        let columnFriendlyName: string = ColumnHelper.getFriendlyNameFromColumnId(this.props.Data.ColumnId, this.props.Columns)

        let alertHeader: string = "Alert for Column: " + columnFriendlyName;

        let helpText: string = "Choose whether to show alerts for all changes to this column, or only when the change matches a rule (to be set by you).";
        let cssClassName: string = this.props.cssClassName + "-rules"

        return <div className={cssClassName}>
            <Panel header={alertHeader} bsStyle="primary">

                <AdaptableBlotterForm >
                    <Col xs={12}>
                        <HelpBlock>{helpText}</HelpBlock>
                    </Col>
                    <Col xs={12} className="ab_large_margin">
                        <Radio inline value="None" checked={this.state.Operator == LeafExpressionOperator.None} onChange={(e) => this.onDisallowEditChanged(e)}>Show Alert for ALL changes</Radio>
                        {' '}<AdaptablePopover cssClassName={cssClassName} headerText={"Alert: All Changes"} bodyText={["An alert will fire for any change."]} MessageType={MessageType.Info} />
                    </Col>
                    <Col xs={12} className="ab_large_margin">
                        <Radio inline value="others" checked={this.state.Operator != LeafExpressionOperator.None} onChange={(e) => this.onDisallowEditChanged(e)}>Show Alert when new cell value matches rule:</Radio>
                        {' '}<AdaptablePopover cssClassName={cssClassName} headerText={"Alert: Custom"} bodyText={["Only show alerts that match the rule defined in the dropdown below."]} MessageType={MessageType.Info} />
                    </Col>
                </AdaptableBlotterForm>

                { /* if not None operator then show operator dropdown */}
                <FormGroup className="ab_large_margin">
                    <Col xs={1}></Col>
                    <Col xs={6}>
                        <FormControl disabled={this.checkOperator(LeafExpressionOperator.None)} componentClass="select" placeholder="select" value={this.state.Operator.toString()} onChange={(x) => this.onOperatorChanged(x)} >
                            {operatorTypes}
                        </FormControl>
                    </Col>

                    { /* if  numeric then show a numeric control */}
                    {!this.checkOperator(LeafExpressionOperator.None) && !this.checkOperator(LeafExpressionOperator.Unknown) && !this.checkOperator(LeafExpressionOperator.IsPositive) && !this.checkOperator(LeafExpressionOperator.IsNegative) && !this.checkOperator(LeafExpressionOperator.IsNotNumber) && this.getColumnDataTypeFromState() == DataType.Number &&
                        <Col xs={5}>
                            <FormControl value={this.state.Operand1} type="number" placeholder="Enter Number" onChange={(x) => this.onOperand1ValueChanged(x)} />
                            {this.isBetweenOperator() &&
                                <FormControl value={this.state.Operand2} type="number" placeholder="Enter Number" onChange={(x) => this.onOperand2ValueChanged(x)} />
                            }
                        </Col>
                    }

                    { /* if  date then show a date control */}
                    {!this.checkOperator(LeafExpressionOperator.None) && !this.checkOperator(LeafExpressionOperator.Unknown) && this.getColumnDataTypeFromState() == DataType.Date &&
                        <Col xs={5}>
                            <FormControl type="date" placeholder="Enter Date" value={this.state.Operand1} onChange={(x) => this.onOperand1ValueChanged(x)} />
                            {this.isBetweenOperator() &&
                                <FormControl value={this.state.Operand2} type="date" placeholder="Enter Date" onChange={(x) => this.onOperand2ValueChanged(x)} />
                            }
                        </Col>
                    }

                    { /* if string then show a text control  */}
                    {!this.checkOperator(LeafExpressionOperator.None) && !this.checkOperator(LeafExpressionOperator.Unknown) && this.getColumnDataTypeFromState() == DataType.String &&
                        <Col xs={5}>
                            <FormControl value={this.state.Operand1} type="string" placeholder="Enter a Value" onChange={(x) => this.onOperand1ValueChanged(x)} />
                        </Col>
                    }
                </FormGroup>

            </Panel>
        </div>

    }


    private onOperatorChanged(event: React.FormEvent<any>) {
        let e = event.target as HTMLInputElement;
        this.setState({ Operator: e.value, Operand1: "", Operand2: "" } as AlertSettingsWizardState, () => this.props.UpdateGoBackState())
    }

    private onOperand1ValueChanged(event: React.FormEvent<any>) {
        let e = event.target as HTMLInputElement;
        this.setState({ Operand1: e.value } as AlertSettingsWizardState, () => this.props.UpdateGoBackState())
    }

    private onOperand2ValueChanged(event: React.FormEvent<any>) {
        let e = event.target as HTMLInputElement;
        this.setState({ Operand2: e.value } as AlertSettingsWizardState, () => this.props.UpdateGoBackState())
    }

    private onDisallowEditChanged(event: React.FormEvent<any>) {
        let e = event.target as HTMLInputElement;
        let operator: LeafExpressionOperator = (e.value == "None") ? LeafExpressionOperator.None : LeafExpressionOperator.Unknown;
        this.setState({ Operator: operator } as AlertSettingsWizardState, () => this.props.UpdateGoBackState())
    }

    private getColumnDataTypeFromState(): DataType {
        return this.props.Columns.find(c => c.ColumnId == this.props.Data.ColumnId).DataType;
    }

    private checkOperator(operator: LeafExpressionOperator): boolean {
        return this.state.Operator == operator;
    }

    private isBetweenOperator(): boolean {
        return this.checkOperator(LeafExpressionOperator.Between) || this.checkOperator(LeafExpressionOperator.NotBetween);
    }

    private getAvailableOperators(): LeafExpressionOperator[] {
        switch (this.getColumnDataTypeFromState()) {
            case DataType.Boolean:
                return [LeafExpressionOperator.Unknown, LeafExpressionOperator.IsTrue, LeafExpressionOperator.IsFalse];
            case DataType.String:
                return [LeafExpressionOperator.Unknown, LeafExpressionOperator.Equals, LeafExpressionOperator.NotEquals, LeafExpressionOperator.Contains, LeafExpressionOperator.NotContains, LeafExpressionOperator.StartsWith, LeafExpressionOperator.Regex];
            case DataType.Date:
                return [LeafExpressionOperator.Unknown, LeafExpressionOperator.Equals, LeafExpressionOperator.NotEquals, LeafExpressionOperator.GreaterThan, LeafExpressionOperator.LessThan, LeafExpressionOperator.Between, LeafExpressionOperator.NotBetween];
            case DataType.Number:
                return [LeafExpressionOperator.Unknown, LeafExpressionOperator.Equals, LeafExpressionOperator.NotEquals, LeafExpressionOperator.LessThan, LeafExpressionOperator.GreaterThan, LeafExpressionOperator.Between, LeafExpressionOperator.NotBetween, LeafExpressionOperator.IsPositive, LeafExpressionOperator.IsNegative, LeafExpressionOperator.ValueChange, LeafExpressionOperator.PercentChange, LeafExpressionOperator.IsNotNumber];
        }
    }



    createAlertDescription(Alert: IAlertDefinition): string {

        let valueDescription: string = ExpressionHelper.OperatorToLongFriendlyString(Alert.Range.Operator, this.getColumnDataTypeFromState());

        if (!this.operatorRequiresValue(Alert.Range.Operator)) {
            return valueDescription;
        }
        let dataType: DataType = this.props.Columns.find(c => c.ColumnId == Alert.ColumnId).DataType;
        let operand1Text: string = (dataType == DataType.Boolean || dataType == DataType.Number) ?
            Alert.Range.Operand1 :
            "'" + Alert.Range.Operand1 + "'"

        valueDescription = valueDescription + operand1Text;

        if (Alert.Range.Operator == LeafExpressionOperator.PercentChange) {
            valueDescription = valueDescription + '%';
        }

        if (StringExtensions.IsNotNullOrEmpty(Alert.Range.Operand2)) {
            let operand2Text: string = (dataType == DataType.Number) ?
                " and " + Alert.Range.Operand2 :
                " and '" + Alert.Range.Operand2 + "'";
            valueDescription = valueDescription + operand2Text;
        }
        return valueDescription;
    }

    private operatorRequiresValue(operator: LeafExpressionOperator): boolean {
        return operator != LeafExpressionOperator.None
            && operator != LeafExpressionOperator.IsPositive
            && operator != LeafExpressionOperator.IsNegative
            && operator != LeafExpressionOperator.IsNotNumber
            && operator != LeafExpressionOperator.IsTrue
            && operator != LeafExpressionOperator.IsFalse;
    }

    public canNext(): boolean {
        if (!this.operatorRequiresValue(this.state.Operator)) {
            return true;
        }

        if (this.checkOperator(LeafExpressionOperator.Unknown)) {
            return false;
        }

        if (this.isBetweenOperator() && StringExtensions.IsNullOrEmpty(this.state.Operand2)) {
            return false;
        }
        return StringExtensions.IsNotNullOrEmpty(this.state.Operand1);
    }

    public canBack(): boolean { return true; }
    public Next(): void {
        let rangeExpression: IRange = {
            Operator: this.state.Operator,
            Operand1: this.state.Operand1,
            Operand2: this.state.Operand2,
            Operand1Type: RangeOperandType.Value,
            Operand2Type: RangeOperandType.Value
        }
        this.props.Data.Range = rangeExpression;
        this.props.Data.Description = this.createAlertDescription(this.props.Data);
    }

    public Back(): void {
        //todo
    }

    public GetIndexStepIncrement() {
        return 1;
    }
    public GetIndexStepDecrement() {
        return 1;
    }
    public StepName = this.props.StepName
}

