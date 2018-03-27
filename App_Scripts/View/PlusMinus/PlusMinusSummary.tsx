import { IPlusMinusRule } from '../../Strategy/Interface/IPlusMinusStrategy';
import * as React from "react";
import * as Redux from "redux";
import { StrategySummaryProps } from '../Components/SharedProps/StrategySummaryProps'
import { EditableConfigEntityState } from '../Components/SharedProps/EditableConfigEntityState';
import { connect } from 'react-redux';
import { Helper } from '../../Core/Helpers/Helper';
import { PlusMinusWizard } from './Wizard/PlusMinusWizard'
import * as PlusMinusRedux from '../../Redux/ActionsReducers/PlusMinusRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import { ObjectFactory } from '../../Core/ObjectFactory';
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import { ExpressionHelper } from '../../Core/Helpers/ExpressionHelper';
import { StrategyHeader } from '../Components/StrategySummary/StrategyHeader'
import { StrategyDetail } from '../Components/StrategySummary/StrategyDetail'
import * as TeamSharingRedux from '../../Redux/ActionsReducers/TeamSharingRedux'
import { UIHelper } from '../UIHelper';
import { IAdaptableBlotterObject } from '../../Core/Interface/Interfaces';

export interface PlusMinusSummaryProps extends StrategySummaryProps<PlusMinusSummaryComponent> {
    PlusMinusRules: IPlusMinusRule[]
    onAddUpdatePlusMinus: (index: number, PlusMinus: IPlusMinusRule) => PlusMinusRedux.PlusMinusAddUpdateConditionAction
    onShare: (entity: IAdaptableBlotterObject) => TeamSharingRedux.TeamSharingShareAction
}

export class PlusMinusSummaryComponent extends React.Component<PlusMinusSummaryProps, EditableConfigEntityState> {

    constructor() {
        super();
        this.state = UIHelper.EmptyConfigState();

    }
    render(): any {
        let strategySummaries: any = []

        // title row
        let titleRow = <StrategyHeader
            key={StrategyNames.PlusMinusStrategyName}
            StrategyId={StrategyIds.PlusMinusStrategyId}
            StrategySummary={Helper.ReturnItemCount(this.props.PlusMinusRules.filter(item => item.ColumnId == this.props.SummarisedColumn.ColumnId), "Plus Minus Condition")}
            onNew={() => this.onNew()}
            NewButtonTooltip={"Plus / Minus Rule"}
        />

        strategySummaries.push(titleRow);

        // existing items
        this.props.PlusMinusRules.map((item, index) => {
            if (item.ColumnId == this.props.SummarisedColumn.ColumnId) {
                let detailRow =
                    <StrategyDetail
                        key={"PM" + index}
                        Item1={"Nudge Value: " + item.NudgeValue}
                        Item2={this.wrapExpressionDescription(ExpressionHelper.ConvertExpressionToString(item.Expression, this.props.Columns, this.props.UserFilters))}
                        ConfigEnity={item}
                        showShare={this.props.TeamSharingActivated}
                        EntityName={StrategyNames.PlusMinusStrategyName}
                        onEdit={() => this.onEdit(index, item)}
                        onShare={() => this.props.onShare(item)}
                        onDelete={PlusMinusRedux.PlusMinusDeleteCondition(index)}
                    />
                strategySummaries.push(detailRow);
            }
        })

        return <div className={this.props.IsReadOnly ? "adaptable_blotter_readonly" : ""}>
            {strategySummaries}

            {this.state.EditedAdaptableBlotterObject &&
                <PlusMinusWizard
                    EditedAdaptableBlotterObject={this.state.EditedAdaptableBlotterObject as IPlusMinusRule}
                    ConfigEntities={null}
                    ModalContainer={this.props.ModalContainer}
                    Columns={this.props.Columns}
                    SelectedColumnId={this.props.SummarisedColumn.ColumnId}
                    UserFilters={this.props.UserFilters}
                    SystemFilters={this.props.SystemFilters}
                    getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList}
                    WizardStartIndex={this.state.WizardStartIndex}
                    onCloseWizard={() => this.onCloseWizard()}
                    onFinishWizard={() => this.onFinishWizard()}
                />
            }
        </div>
    }


    onNew() {
        let configEntity: IPlusMinusRule = ObjectFactory.CreateEmptyPlusMinusRule()
        configEntity.ColumnId = this.props.SummarisedColumn.ColumnId;
        this.setState({ EditedAdaptableBlotterObject: configEntity, WizardStartIndex: 1, EditedAdaptableBlotterObjectIndex: -1 });
    }

    onEdit(index: number, PlusMinus: IPlusMinusRule) {
        this.setState({ EditedAdaptableBlotterObject: Helper.cloneObject(PlusMinus), WizardStartIndex: 1, EditedAdaptableBlotterObjectIndex: index });
    }

    onCloseWizard() {
        this.setState({ EditedAdaptableBlotterObject: null, WizardStartIndex: 0, EditedAdaptableBlotterObjectIndex: -1, });
    }

    onFinishWizard() {
        this.props.onAddUpdatePlusMinus(this.state.EditedAdaptableBlotterObjectIndex, this.state.EditedAdaptableBlotterObject as IPlusMinusRule);
        this.setState({ EditedAdaptableBlotterObject: null, WizardStartIndex: 0, EditedAdaptableBlotterObjectIndex: -1, });
    }

    wrapExpressionDescription(expressionDescription: string): string {
        return (expressionDescription == "Any") ? "[Default Column Nudge Value]" : expressionDescription;
    }

}
function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        Columns: state.Grid.Columns,
        PlusMinusRules: state.PlusMinus.PlusMinusRules,
        UserFilters: state.UserFilter.UserFilters,
        SystemFilters: state.SystemFilter.SystemFilters
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onAddUpdatePlusMinus: (index: number, PlusMinus: IPlusMinusRule) => dispatch(PlusMinusRedux.PlusMinusAddUpdateCondition(index, PlusMinus)),
        onClearPopupParams: () => dispatch(PopupRedux.PopupClearParam()),
        onShare: (entity: IAdaptableBlotterObject) => dispatch(TeamSharingRedux.TeamSharingShare(entity, StrategyIds.PlusMinusStrategyId))
    };
}

export let PlusMinusSummary = connect(mapStateToProps, mapDispatchToProps)(PlusMinusSummaryComponent);

