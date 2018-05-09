import * as Redux from 'redux';
import { DashboardState } from './Interface/IState'
import { Helper } from '../../Core/Helpers/Helper';
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import { ArrayExtensions } from '../../Core/Extensions/ArrayExtensions';
import { Visibility } from '../../Core/Enums';

const DASHBOARD_CHANGE_CONTROL_VISIBILITY = 'DASHBOARD_CHANGE_CONTROL_VISIBILITY';
const DASHBOARD_MOVE_ITEM = 'DASHBOARD_MOVE_ITEM';
const DASHBOARD_SET_FUNCTION_BUTTONS_ITEM = 'DASHBOARD_SET_FUNCTION_BUTTONS_ITEM';
const DASHBOARD_SET_ZOOM = 'DASHBOARD_SET_ZOOM';
const DASHBOARD_SET_VISIBILITY = 'DASHBOARD_SET_VISIBILITY';

export interface DashboardChangeControlVisibilityAction extends Redux.Action {
    StrategyId: string;
}

export interface DashboardMoveItemAction extends Redux.Action {
    StrategyId: string;
    NewIndex: number
}

export interface DashboardCreateDefaultConfigurationItemAction extends Redux.Action {
    StrategyId: string;
}

export interface DashboardSetFunctionButtonsAction extends Redux.Action {
    StrategyIds: string[];
}

export interface DashboardSetZoomAction extends Redux.Action {
    Zoom: Number
}

export interface DashboardSetVisibilityAction extends Redux.Action {
    Visibility: Visibility
}

export const ChangeVisibilityDashboardControl = (StrategyId: string): DashboardChangeControlVisibilityAction => ({
    type: DASHBOARD_CHANGE_CONTROL_VISIBILITY,
    StrategyId
})

export const DashboardMoveItem = (StrategyId: string, NewIndex: number): DashboardMoveItemAction => ({
    type: DASHBOARD_MOVE_ITEM,
    StrategyId,
    NewIndex
})

export const DashboardSetFunctionButtons = (StrategyIds: string[]): DashboardSetFunctionButtonsAction => ({
    type: DASHBOARD_SET_FUNCTION_BUTTONS_ITEM,
    StrategyIds,

})

export const DashboardSetZoom = (Zoom: Number): DashboardSetZoomAction => ({
    type: DASHBOARD_SET_ZOOM,
    Zoom
})

export const DashboardSetVisibility = (Visibility: Visibility): DashboardSetVisibilityAction => ({
    type: DASHBOARD_SET_VISIBILITY,
    Visibility
})

const initialDashboardState: DashboardState = {
    AvailableToolbars: [StrategyIds.AdvancedSearchStrategyId, StrategyIds.QuickSearchStrategyId, StrategyIds.LayoutStrategyId, StrategyIds.ExportStrategyId, StrategyIds.ColumnFilterStrategyId, StrategyIds.DataSourceStrategyId],
    VisibleToolbars: [StrategyIds.AdvancedSearchStrategyId, StrategyIds.QuickSearchStrategyId, StrategyIds.LayoutStrategyId, StrategyIds.ExportStrategyId, StrategyIds.ColumnFilterStrategyId],
    VisibleButtons: [StrategyIds.AboutStrategyId, StrategyIds.DashboardStrategyId, StrategyIds.SmartEditStrategyId, StrategyIds.ColumnChooserStrategyId, StrategyIds.ConditionalStyleStrategyId, StrategyIds.TeamSharingStrategyId],
    Zoom: 1,
    DashboardVisibility: Visibility.Visible
}

export const DashboardReducer: Redux.Reducer<DashboardState> = (state: DashboardState = initialDashboardState, action: Redux.Action): DashboardState => {
    let index: number;
    let dashboardControls: string[]
    let dashboardControl: string

    switch (action.type) {
        case DASHBOARD_CHANGE_CONTROL_VISIBILITY: {
            let actionTypedVisibility = <DashboardChangeControlVisibilityAction>action;
            dashboardControls = [].concat(state.VisibleToolbars);
            index = dashboardControls.findIndex(a => a == actionTypedVisibility.StrategyId)

            if (index < 0) {  // doesnt exist so add it
                dashboardControls.push(actionTypedVisibility.StrategyId)
            } else {  // exists so delete it
                dashboardControls.splice(index, 1)
            }
            return Object.assign({}, state, { VisibleToolbars: dashboardControls });
        }
        case DASHBOARD_MOVE_ITEM: {
            let actionTyped = <DashboardMoveItemAction>action;
            dashboardControls = [].concat(state.VisibleToolbars);
            index = dashboardControls.findIndex(a => a == actionTyped.StrategyId)
            ArrayExtensions.moveArray(dashboardControls, index, actionTyped.NewIndex)
            return Object.assign({}, state, { VisibleToolbars: dashboardControls });
        }
        case DASHBOARD_SET_FUNCTION_BUTTONS_ITEM: {
            let actionTyped = <DashboardSetFunctionButtonsAction>action;
            let dashboardFunctionButtons = actionTyped.StrategyIds
            return Object.assign({}, state, { VisibleButtons: dashboardFunctionButtons });
        }
        case DASHBOARD_SET_ZOOM: {
            let actionTyped = <DashboardSetZoomAction>action;
            return Object.assign({}, state, { Zoom: actionTyped.Zoom });
        }
        case DASHBOARD_SET_VISIBILITY: {
            let actionTyped = <DashboardSetVisibilityAction>action;
            return Object.assign({}, state, { DashboardVisibility: actionTyped.Visibility });
        }
        default:
            return state
    }
}