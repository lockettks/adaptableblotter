import * as React from "react";
import { MessageType } from '../../Core/Enums';
import { AdaptablePopover } from "../AdaptablePopover";
import { IPreviewResult, IPreviewInfo } from "../../Core/Interface/IPreviewResult";
import { Glyphicon, Panel, Table } from "react-bootstrap";
import { ExpressionHelper } from "../../Core/Helpers/ExpressionHelper";
import { IColumn } from "../../Core/Interface/IColumn";
import * as StyleConstants from '../../Core/Constants/StyleConstants';
import { IUserFilter, ICellValidationRule } from "../../Core/Api/Interface/AdaptableBlotterObjects";


export interface PreviewResultsPanelProps extends React.ClassAttributes<PreviewResultsPanel> {
    UpdateValue: string;
    PreviewInfo: IPreviewInfo;
    Columns: IColumn[];
    UserFilters: IUserFilter[];
    SelectedColumn: IColumn;
    ShowPanel: boolean
    cssClassName: string
    ShowHeader: boolean
}

export class PreviewResultsPanel extends React.Component<PreviewResultsPanelProps, {}> {
    render(): any {
        let cssClassName: string = this.props.cssClassName + StyleConstants.PREVIEW_RESULTS
        let previewHeader: string = this.props.ShowHeader && this.props.PreviewInfo != null ? "Preview Results: " + (this.props.SelectedColumn ? this.props.SelectedColumn.FriendlyName : "") : "";


        var previewItems = this.props.PreviewInfo.PreviewResults.map((previewResult: IPreviewResult) => {

            return <tr key={previewResult.Id} >
                <td>{previewResult.InitialValue}</td>
                <td>{previewResult.ComputedValue}</td>
                {previewResult.ValidationRules.length > 0 ?
                    <td>
                        {this.props.PreviewInfo.PreviewValidationSummary.HasValidationPrevent == true &&
                            <AdaptablePopover cssClassName={cssClassName} headerText={"Validation Error"} bodyText={[this.getValidationErrorMessage(previewResult.ValidationRules)]} MessageType={MessageType.Error} />
                        }
                        {this.props.PreviewInfo.PreviewValidationSummary.HasValidationWarning == true &&
                            <AdaptablePopover cssClassName={cssClassName} headerText={"Validation Error"} bodyText={[this.getValidationErrorMessage(previewResult.ValidationRules)]} MessageType={MessageType.Warning} />
                        }
                    </td>
                    :
                    <td> <Glyphicon glyph="ok" /> </td>
                }
            </tr>
        });
        var header = <thead>
            <tr>
                <th>Old Value</th>
                <th>New Value</th>
                <th>Valid</th>
            </tr>
        </thead>

        return <div className={cssClassName}>
            {this.props.ShowPanel &&
                <Panel header={previewHeader} bsStyle="info" className="ab_preview_panel">
                    <div>
                        <Table  >
                            {header}
                            <tbody style={{minWidth: "500px"}}>
                                {previewItems}
                            </tbody>
                        </Table>
                    </div>
                </Panel>
            }
        </div>
    }

    private getValidationErrorMessage(CellValidations: ICellValidationRule[]): string {
        let returnString: string[] = []
        for (let CellValidation of CellValidations) {
            let expressionDescription: string = (ExpressionHelper.IsNotEmptyExpression( CellValidation.Expression)) ?
                " when " + ExpressionHelper.ConvertExpressionToString(CellValidation.Expression, this.props.Columns, this.props.UserFilters) :
                "";
            returnString.push(CellValidation.Description + expressionDescription)
        }
        return returnString.join("\n");
    }

}


