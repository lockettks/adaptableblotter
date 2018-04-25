import * as React from "react";
import { AdaptableWizardStep, AdaptableWizardStepProps } from './../../Wizard/Interface/IAdaptableWizard'
import { IFormatColumn } from '../../../Strategy/Interface/IFormatColumnStrategy';
import { FontWeight, FontStyle, FontSize } from '../../../Core/Enums';
import { StyleComponent } from '../../Components/StyleComponent';
import { IStyle } from '../../../Core/Interface/IStyle';
import { StringExtensions } from "../../../Core/Extensions/StringExtensions";
import { StyleVisualItem } from '../../Components/StyleVisualItem'
import { KeyValuePair } from "../../UIInterfaces";
import { WizardSummaryPage } from "../../Components/WizardSummaryPage";
import * as StrategyNames from '../../../Core/Constants/StrategyNames'
import { IColumn } from "../../../Core/Interface/IColumn";


export interface FormatColumnSummaryWizardProps extends AdaptableWizardStepProps<IFormatColumn> {
    Columns: IColumn[]
}
export class FormatColumnSummaryWizard extends React.Component<FormatColumnSummaryWizardProps, {}> implements AdaptableWizardStep {

    constructor(props: FormatColumnSummaryWizardProps) {
        super(props)
        this.state = { Style: this.props.Data.Style }
    }

    render() {

        let cssClassName: string = this.props.cssClassName + "-summary"
       
        let keyValuePairs: KeyValuePair[] = [
            { Key: "Scope", Value: this.props.Columns.find(c => c.ColumnId == this.props.Data.ColumnId).FriendlyName },
            { Key: "Style", Value: <StyleVisualItem Style={this.props.Data.Style} /> },
         ]

        let summaryPage = <WizardSummaryPage cssClassName={cssClassName} KeyValuePairs={keyValuePairs} header={StrategyNames.FormatColumnStrategyName} />
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

    public GetIndexStepIncrement(){
        return 1;
    }
    public GetIndexStepDecrement(){
        return 1;
    }



    public StepName = this.props.StepName

}

