import { LeafExpressionOperator, ReportColumnScope, ReportRowScope, MessageType } from '../../Enums';
import { Expression } from '../Expression';


/**
 * The base Adaptable Blotter Object interface 
 * @property {boolean} IsReadOnly - whether the object can be edited for users.  Set to true if you dont want the objects you ship with the blotter to be edited / deleted by users.
 */
export interface IAdaptableBlotterObject {
  IsReadOnly: boolean
}

/**
 * Any column values contained in the expression, grouped by column (using their DISPLAY value, not their raw value)
 */
export interface IColumnValueExpression {
  ColumnId: string,
  ColumnValues: string[]
}

/**
 * Any filters - user, system or column - contained in the expression, grouped by column
 */
export interface IFilterExpression {
  ColumnId: string,
  Filters: string[]
}

/**
 * Any ranges contained in the expression, grouped by column
 */
export interface IRangeExpression {
  ColumnId: string,
  Ranges: IRange[]
}

/**
 * Objects which performs comparisons on values or other columns
 */
export interface IRange {
  /**
   * Operator for the range (e.g. Greater Than, Equals), varies according to the column data type
   */
  Operator: LeafExpressionOperator
  /**
  * Comparison value - can either be a static column valur or name of another column (set in Operand1Type property)
  */
  Operand1: string;
  /**
  * Comparison value - can either be a static column valur or name of another column (set in Operand2Type property).  Only used when operator is 'Between' 
  */
  Operand2: string;
  /**
   * Whether first operand is a static value or the name of a column; if latter then we look up that column's value in real time when evaluating the expression
   */
  Operand1Type: 'Value' | 'Column'
  /**
   * Whether second operand is a static value or the name of a column; if latter then we look up that column's value in real time when evaluating the expression
   */
  Operand2Type: 'Value' | 'Column'
}



// Core objects for Strategies
export interface IAlertDefinition extends IAdaptableBlotterObject {
    ColumnId: string;
    Range: IRange;
    Description: string;
    Expression: Expression;
    MessageType: MessageType;
    ShowAsPopup: boolean
  }

export interface IAdvancedSearch extends IAdaptableBlotterObject {
  Name: string,
  Expression: Expression,
}


export interface ICalculatedColumn extends IAdaptableBlotterObject {
  ColumnId: string;
  ColumnExpression: string
}

export interface ICalendar extends IAdaptableBlotterObject {
  Name: string;
  YearName: Number;
  CalendarEntries: ICalendarEntry[];
}

export interface ICalendarEntry {
  HolidayName: string;
  HolidayDate: string;
}

export interface ICellValidationRule extends IAdaptableBlotterObject {
  ColumnId: string;
  Range: IRange,
  ActionMode: 'Warn User' | 'Stop Edit';
  Description: string;
  Expression: Expression;
}

export interface IColumnFilter extends IAdaptableBlotterObject {
  ColumnId: string
  Filter: Expression
}

export interface IConditionalStyle extends IAdaptableBlotterObject {
  ColumnId: string
  ConditionalStyleScope: 'Column' | 'Row'
  Expression: Expression
  Style: IStyle
}

export interface ICustomSort extends IAdaptableBlotterObject {
  ColumnId: string;
  SortedValues: string[]
}

export interface IReport extends IAdaptableBlotterObject {
  Name: string;
  ReportColumnScope: ReportColumnScope
  ReportRowScope: ReportRowScope
  Columns: string[]
  Expression: Expression,
}

export interface IFlashingCell extends IAdaptableBlotterObject {
  IsLive: boolean,
  ColumnId: string;
  FlashingCellDuration: number;
  UpColor: string
  DownColor: string
}

export interface IFormatColumn extends IAdaptableBlotterObject {
  ColumnId: string
  Style: IStyle
}

export interface ILayout extends IAdaptableBlotterObject {
  Name: string;
  Columns: string[];
  GridSorts: IGridSort[]
  VendorGridInfo?: any
}

export interface IPlusMinusRule extends IAdaptableBlotterObject {
  ColumnId: string
  IsDefaultNudge: boolean
  NudgeValue: number
  Expression: Expression
}

/**
 * Used to define a Keyboard Shortcut as used in the Shortcuts function
 */
export interface IShortcut extends IAdaptableBlotterObject {
  /**
   * Key which when pressed on keyboard triggers the shortcut
   */
  ShortcutKey: string;
  /**
   * Output of the function; if 'date' then its always a new value; if 'number' then it can be computed with existing edit value
   */
  ShortcutResult: any;
  /**
   * What the function does; Date shortcuts only replace; Numeric shortcuts can make a computation based on existing value and 'ShortcutResult' property
   */
  ShortcutOperation: 'Add' | 'Subtract' | 'Multiply' | 'Divide' | 'Replace'
  /**
   * Which columns the keyboard is active on. 
   */
  ColumnType: 'Number' | 'Date';
  /**
   * If its a system
   */
  IsDynamic: boolean
}

export interface IUserFilter extends IAdaptableBlotterObject {
  Name: string;
  Expression: Expression;
  ColumnId: string
}

export interface IUserTheme extends IAdaptableBlotterObject {
  Name: string;
  Url: string
}


// used in layouts to save which is the current sorted column
export interface IGridSort {
  Column: string;
  SortOrder: 'Unknown' | 'Ascending' | 'Descending'
}

export interface IStyle {
  BackColor?: string
  ForeColor?: string
  FontWeight?: 'Normal' | 'Bold'
  FontStyle?: 'Normal' | 'Italic'
  FontSize?: 'XSmall' | 'Small' | 'Medium' | 'Large' | 'XLarge'
  ClassName?: string
}


