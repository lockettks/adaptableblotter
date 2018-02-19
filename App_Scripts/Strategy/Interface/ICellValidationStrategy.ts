import { IStrategy } from './IStrategy';
import { CellValidationMode } from '../../Core/Enums';
import { IRange } from '../../Core/Interface/IExpression';
import { Expression } from '../../Core/Expression'
import { IConfigEntity } from '../../Core/Interface/IAdaptableBlotter';
export interface ICellValidationStrategy extends IStrategy {
}

export interface ICellValidationRule extends IConfigEntity {
        ColumnId: string;
        Range: IRange,
        CellValidationMode: CellValidationMode;
        Description: string;
        HasExpression: boolean;
        OtherExpression: Expression;
}