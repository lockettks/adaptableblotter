import * as React from "react";
import { ControlLabel, FormGroup, FormControl, Col, Panel, HelpBlock } from 'react-bootstrap';
import { AdaptableWizardStep, AdaptableWizardStepProps } from '../../Wizard/Interface/IAdaptableWizard'
import { StringExtensions } from '../../../Core/Extensions/StringExtensions';
import { AdaptableBlotterForm } from "../../Components/Forms/AdaptableBlotterForm";
import { PanelWithImage } from '../../Components/Panels/PanelWithImage';
import { AdaptableObjectRow } from "../../Components/AdaptableObjectRow";
import { IColItem, KeyValuePair } from "../../UIInterfaces";
import { PanelWithRow } from "../../Components/Panels/PanelWithRow";
import { Helper } from "../../../Core/Helpers/Helper";
import * as StyleConstants from '../../../Core/Constants/StyleConstants';
import { AdaptableObjectCollection } from '../../Components/AdaptableObjectCollection';
import { ExpressionHelper } from "../../../Core/Helpers/ExpressionHelper";
import { IColumn } from "../../../Core/Interface/IColumn";
import { WizardSummaryPage } from "../../Components/WizardSummaryPage";
import * as StrategyNames from '../../../Core/Constants/StrategyNames'
import { IAdvancedSearch, IUserFilter } from "../../../Core/Api/Interface/AdaptableBlotterObjects";

export interface AdvancedSearchSummaryWizardProps extends AdaptableWizardStepProps<IAdvancedSearch> {
    Columns: IColumn[]
    UserFilters: IUserFilter[]
}


export class AdvancedSearchSummaryWizard extends React.Component<AdvancedSearchSummaryWizardProps, {}> implements AdaptableWizardStep {
    constructor(props: AdvancedSearchSummaryWizardProps) {
        super(props)
    }
    render(): any {
        let cssClassName: string = this.props.cssClassName + "-summary"

        let keyValuePairs: KeyValuePair[] = [
            { Key: "Name", Value: this.props.Data.Name },
            { Key: "Query", Value: ExpressionHelper.ConvertExpressionToString( this.props.Data.Expression, this.props.Columns, this.props.UserFilters) }
        ]

        let summaryPage = <WizardSummaryPage cssClassName={cssClassName} KeyValuePairs={keyValuePairs} header={StrategyNames.AdvancedSearchStrategyName} />
        return <div className={cssClassName}>
            {summaryPage}
        </div>
    }


    public canNext(): boolean {
        return true;
    }


    public canBack(): boolean { return true; }

    public Next(): void {
        // todo  
    }
    public Back(): void {
        // todo
    }

    public GetIndexStepIncrement() {
        return 1;
    }
    public GetIndexStepDecrement() {
        return 1;
    }
    public StepName = this.props.StepName
}

