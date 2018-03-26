import { IStrategy } from './IStrategy';
import {  DataType } from '../../Core/Enums'
import { Expression } from '../../Core/Expression'
import { IAdaptableBlotter } from '../../Core/Interface/IAdaptableBlotter'
import { IAdaptableBlotterObject } from '../../Core/Interface/Interfaces';

export interface IUserFilterStrategy extends IStrategy{
}

export interface IUserFilter extends IAdaptableBlotterObject {
    Name: string;
    Expression: Expression;
    ColumnId: string
}

export interface ISystemFilter extends IAdaptableBlotterObject {
    Name: string;
  //  Description: string;
    DataType: DataType;
    IsExpressionSatisfied?: (valueToCheck: any, blotter: IAdaptableBlotter) => boolean;
  }

   

