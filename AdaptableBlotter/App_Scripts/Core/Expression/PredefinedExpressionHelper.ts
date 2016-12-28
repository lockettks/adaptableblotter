import { Expression } from './Expression'
import { IExpressionRange } from '../Interface/IExpression';
import { LeafExpressionOperator } from '../Enums';

/*  
 Not sure about this still but I THINK its a good idea.
 Basically we want to make it easy for uses to create common conditions; they can still edit them later if we want.
 Once we have Filters working we should add "future" and "past" conditions to work on date columns where < or > "Today"
It could be that the whole thing adds a layer of complexity that is not justified, because we need to create the condition on the fly... who knows?
*/

export interface IPredefinedExpressionInfo {
    Id: string
    FriendlyName: string
    Operator: LeafExpressionOperator
    Operand1: string
    Operand2: string
    BackColor: string
    ForeColor: string
}

export module PredefinedExpressionHelper {
    export function CreatePredefinedExpression(columnName: string, predefinedExpression: IPredefinedExpressionInfo): Expression {

        let columnValuesExpression: Array<{ ColumnName: string, Values: Array<any> }> = [];

        let expressionRange: IExpressionRange = { Operand1: predefinedExpression.Operand1, Operator: predefinedExpression.Operator, Operand2: predefinedExpression.Operand2 };
        let expressionRanges: Array<IExpressionRange> = [];
        expressionRanges.push(expressionRange);
        let singleRangeExpression: { ColumnName: string, Ranges: Array<IExpressionRange> } = { ColumnName: columnName, Ranges: expressionRanges }
        let rangeExpression: Array<{ ColumnName: string, Ranges: Array<IExpressionRange> }> = [];
        rangeExpression.push(singleRangeExpression);
        return new Expression(columnValuesExpression, "Any", rangeExpression);
    }


    export function GetPredefinedExpressions(): IPredefinedExpressionInfo[] {
        //RGBA might not be 100% compatible with all browsesrs
        return [
            { Id: "PositiveGreen", FriendlyName: "Positive numbers in green font", BackColor: 'rgba(0, 0, 0, 0)', ForeColor: '#008000', Operator: LeafExpressionOperator.GreaterThanOrEqual, Operand1: "0", Operand2: "" },
             { Id: "NegativeRed", FriendlyName: "Negative numbers in red font", BackColor: 'rgba(0, 0, 0, 0)', ForeColor: '#FF0000', Operator: LeafExpressionOperator.LessThan, Operand1: "0", Operand2: "" },
        ]
    }

}

