import { IEvent } from "../../Interface/IEvent";
import { IAdaptableBlotter } from "../../Interface/IAdaptableBlotter";
import { ISearchChangedEventArgs } from "./ServerSearch";
import { IAdvancedSearch, ILayout, IStyle, IColumnFilter, IUserFilter, ICustomSort, IUserTheme, IShortcut, ICalculatedColumn, ICellValidationRule, IFormatColumn } from "./AdaptableBlotterObjects";
import { IEntitlement } from "../../Interface/Interfaces";
import { AdaptableBlotterState } from "../../../Redux/Store/Interface/IAdaptableStore";

/**
 * The main interface between users (devs) and the Blotter while the system is up and running
 */
export interface IBlotterApi {
  /**
   * Repopulates the grid; typically used after listening to a SearchChanged event, so appropriately filtered data on the server can be sent to the Blotter.
   * @param data can be any data from any datasource that is suitable for the underlying grid.  
   */
  setGridData(data: any): void;


  /**
   * Selects the layout
   * @param layoutName has to be an existing layout
   */
  layoutSet(layoutName: string): void

  /**
   * Clears the currently selected layout
   */
  layoutClear(): void

  /**
   * Retrieves all Layouts in State
   */
  layoutGetCurrent(): ILayout
  /**
* Runs QuickSearch on the supplied text
* @param quickSearchText text to run QuickSearch on
*/
  quickSearchRun(quickSearchText: string): void

  /**
   * Clears Quick Search
   */
  quickSearchClear(): void

  /**
   * Retrieves the current quick search text
   */
  quickSearchGetValue(): string
  /**
   * Sets the Quick Search Operator
   * @param operator Either 'Contains' to return any cell containing the text or 'StartsWith' to return only those where the value starts with the text
   */
  quickSearchSetOperator(operator: 'Contains' | 'StartsWith'): void
  quickSearchSetDisplayAction(displayAction: 'HighlightCell' | 'ShowRow' | 'ShowRowAndHighlightCell'): void
  quickSearchSetStyle(style: IStyle): void

  /**
  * Selects the dataSource
  * @param dataSource has to be an existing dataSource
  */
  dataSourceSet(dataSource: string): void

  /**
   * Clears the currently selected dataSource
   */
  dataSourceClear(): void

  // Advanced Search api methods
  advancedSearchSet(advancedSearchName: string): void
  advancedSearchClear(): void
  advancedSearchAdd(advancedSearch: IAdvancedSearch): void
  advancedSearchEdit(advancedSearchName: string, advancedSearch: IAdvancedSearch): void
  advancedSearchDelete(advancedSearchName: string): void
  advancedSearchGetCurrent(): IAdvancedSearch
  advancedSearchGetByName(advancedSearchName: string): IAdvancedSearch
  advancedSearchGetAll(): IAdvancedSearch[]

  // Dashboard api methods
  dashboardSetAvailableToolbars(availableToolbars: string[]): void
  dashboardSetVisibleToolbars(visibleToolbars: string[]): void
  dashboardShowToolbar(visibleToolbar: string): void
  dashboardHideToolbar(visibleToolbar: string): void
  dashboardSetVisibleButtons(functionButtons: string[]): void
  dashboardSetZoom(zoom: Number): void
  dashboardSetVisibility(dashboardVisibility: 'Minimised' | 'Visible' | 'Hidden'): void
  dashboardShow():void
  dashboardHide():void
  dashboardMinimise():void

  // Calendar State
  calendarSetCurrent(calendar: string): void
  calendarGetCurrent(): string

  // Theme State
  themeSetCurrent(theme: string): void
  themeGetCurrent(): string
  themeSetSystemThemes(systemThemes: string[]): void
  themeSetUserThemes(userThemes: string[]): void
  themeSystemThemeGetAll(): string[]
  themeUserThemeGetAll(): IUserTheme[]

  // Shortcut api methods
  shortcutGetAll(): IShortcut[]
  shortcutAdd(shortcut: IShortcut): void
  shortcutDelete(shortcut: IShortcut): void
  shortcutDeleteAll(): void

  // SmartEdit api methods
  smartEditSetMathOperation(mathOperation: 'Add' | 'Subtract' | 'Multiply' | 'Divide' | 'Replace'): void
  smartEditGetMathOperation(): string
  smartEditSetValue(smartEditValue: number): void
  smartEditGetValue(): number

  // user interface api methods
  uiSetColorPalette(colorPalette: string[]): void
  uiAddColorsToPalette(colorPalette: string[]): void
  uiAddStyleClassNames(styleClassNames: string[]): void
  uiSetColumnPermittedValues(column: string, permittedValues: string[]): void
  uiClearColumnPermittedValues(column: string): void


  // filter api methods
  filterSetColumnFilters(columnFilters: IColumnFilter[]): void
  filterSetUserFilters(userFilters: IUserFilter[]): void
  filterSetSystemFilters(systemFilters: string[]): void
  filterClearSystemFilters(): void
  filterGetCurrentSystemFilters(): string[]
  filterGetAllSystemFilters(): string[]

  // Entitlement Methods
  entitlementGetAll(): IEntitlement[]
  entitlementGetByFunction(functionName: string): IEntitlement
  entitlementGetAccessLevelForFunction(functionName: string): string
  entitlementAddOrUpdate(functionName: string, accessLevel: "ReadOnly" | "Hidden" | "Default"): void
  entitlementDelete(functionName: string): void

  // Custom Sort Methods
  customSortGetAll(): ICustomSort[]
  customSortGetByColumn(columnn: string): ICustomSort
  customSortAdd(column: string, values: string[]): void
  customSortEdit(column: string, values: string[]): void
  customSortDelete(column: string): void

  // Calculated Column State
  calculatedColumnGetAll(): ICalculatedColumn[]
  calculatedColumnAdd(calculatedColumn: ICalculatedColumn): void
  calculatedColumnEditExpression(column: string, columnExpression: string): void
  calculatedColumnDelete(column: string): void


  // CellValidation State
  cellValidationGetAll(): ICellValidationRule[]
  cellValidationAdd(cellValidationRule: ICellValidationRule): void
  cellValidationDelete(cellValidationRule: ICellValidationRule): void

  // FormatColumn State
  formatColumnGetAll(): IFormatColumn[]
  formatColumnnAdd(column: string, style: IStyle): void
  formatColumnnUpdate(column: string, style: IStyle): void
  formatColumnDelete(formatColumn: IFormatColumn): void
  formatColumnDeleteAll(): void

  // System Status
  /**
   * Sets which coloured System Status button is displayed in the Home Toolbar
   * @param statusMessage The message to show when the button is clicked
   * @param statusColour The colour of the buttton - also influences the type of message (red: error, amber: warning etc)
   */
  systemStatusSet(statusMessage: string, statusColour: "Red" | "Amber" | "Green"): void

  systemStatusSetRed(statusMessage: string): void
  systemStatusSetAmber(statusMessage: string): void
  systemStatusSetGreen(statusMessage: string): void

  /**
   * Clears any System Status messages - and sets teh button to green
   */
  systemStatusClear(): void

  // Alerts
  /**
   * Shows an alert as a popup
   * @param alertHeader Title to appear in the popup
   * @param alertMessage Main message of the alert
   * @param MessageType Type (Info, Warning or Error) of the Alert - depending on this value the image and colour of the alert will change.
   */
  alertShow(alertHeader: string, alertMessage: string, MessageType: "Info" | "Warning" | "Error", showAsPopup: boolean): void

  alertShowMessage(alertHeader: string, alertMessage: string, showAsPopup: boolean): void
  alertShowWarning(alertHeader: string, alertMessage: string, showAsPopup: boolean): void
  alertShowError(alertHeader: string, alertMessage: string, showAsPopup: boolean): void


  // General Config

  /**
   * Clears the  configuration for the current user, reverting everyting to system defaults.
   * This includes clearing all predefined items that have been created fo the users (though they will subsequently be re-applied if the local cache is cleared).
   *  */
  configClear(): void
  configGet(): AdaptableBlotterState


  /**
  * Event fired whenever search criteria in the Blotter changes, providing full coverage of what triggered the change and the current Search and Filter state.
  * @returns IEvent<IAdaptableBlotter, ISearchChangedEventArgs>
  */
  onSearchedChanged(): IEvent<IAdaptableBlotter, ISearchChangedEventArgs>;
}



