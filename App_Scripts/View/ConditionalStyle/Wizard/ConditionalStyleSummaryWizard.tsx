import * as React from "react";
import { Radio, Col, Panel } from 'react-bootstrap';
import { IColumn } from '../../../Core/Interface/IColumn';
import { AdaptableWizardStep, AdaptableWizardStepProps } from '../../Wizard/Interface/IAdaptableWizard'
import { StringExtensions } from '../../../Core/Extensions/StringExtensions';
import { AdaptablePopover } from '../../AdaptablePopover';
import { ColumnSelector } from "../../Components/Selectors/ColumnSelector";
import { AdaptableBlotterForm } from "../../Components/Forms/AdaptableBlotterForm";
import { StyleVisualItem } from '../../Components/StyleVisualItem'
import { KeyValuePair } from "../../UIInterfaces";
import { WizardSummaryPage } from "../../Components/WizardSummaryPage";
import * as StrategyNames from '../../../Core/Constants/StrategyNames'
import { ExpressionHelper } from "../../../Core/Helpers/ExpressionHelper";
import { ConditionalStyleScope } from "../../../Core/Enums";
import { IConditionalStyle, IUserFilter } from "../../../Core/Api/Interface/AdaptableBlotterObjects";
import { ColumnHelper } from "../../../Core/Helpers/ColumnHelper";

export interface ConditionalStyleSummaryWizardProps extends AdaptableWizardStepProps<IConditionalStyle> {
    Columns: IColumn[]
    UserFilters: IUserFilter[]
}

export class ConditionalStyleSummaryWizard extends React.Component<ConditionalStyleSummaryWizardProps, {}> implements AdaptableWizardStep {

    constructor(props: ConditionalStyleSummaryWizardProps) {
        super(props)
    }

    render(): any {
        let cssClassName: string = this.props.cssClassName + "-summary"

        let keyValuePairs: KeyValuePair[] = [
            {
                Key: "Scope", Value: this.props.Data.ConditionalStyleScope == ConditionalStyleScope.Row ? "Row" :
                    ColumnHelper.getFriendlyNameFromColumnId(this.props.Data.ColumnId, this.props.Columns)
            },
            { Key: "Style", Value: <StyleVisualItem Style={this.props.Data.Style} /> },
            { Key: "Query", Value: ExpressionHelper.ConvertExpressionToString(this.props.Data.Expression, this.props.Columns, this.props.UserFilters) }
        ]

        let summaryPage = <WizardSummaryPage cssClassName={cssClassName} KeyValuePairs={keyValuePairs} header={StrategyNames.ConditionalStyleStrategyName} />
        return <div className={cssClassName}>
            {summaryPage}
        </div>
    }

    public canNext(): boolean { return true; }

    public canBack(): boolean { return true; }
    public Next(): void {
        //
    }

    public Back(): void { // todo
    }

    public GetIndexStepIncrement() {
        return 1;
    }
    public GetIndexStepDecrement() {
        return 1;
    }
    public StepName = this.props.StepName
}


