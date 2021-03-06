import * as React from "react";
import * as Redux from "redux";
import { connect } from 'react-redux';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as FormatColumnRedux from '../../Redux/ActionsReducers/FormatColumnRedux'
import { StrategyViewPopupProps } from '../Components/SharedProps/StrategyViewPopupProps'
import { IColumn } from '../../Core/Interface/IColumn';
import { Well } from 'react-bootstrap';
import { FormatColumnEntityRow } from './FormatColumnEntityRow'
import { FormatColumnWizard } from './Wizard/FormatColumnWizard'
import { Helper } from '../../Core/Helpers/Helper';
import { PanelWithButton } from '../Components/Panels/PanelWithButton';
import { ObjectFactory } from '../../Core/ObjectFactory';
import { ButtonNew } from '../Components/Buttons/ButtonNew';
import { StringExtensions } from '../../Core/Extensions/StringExtensions'
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as StrategyGlyphs from '../../Core/Constants/StrategyGlyphs'
import * as TeamSharingRedux from '../../Redux/ActionsReducers/TeamSharingRedux'
import { EditableConfigEntityState } from '../Components/SharedProps/EditableConfigEntityState';
import { AdaptableObjectCollection } from '../Components/AdaptableObjectCollection';
import { IColItem } from "../UIInterfaces";
import * as StyleConstants from '../../Core/Constants/StyleConstants';
import { UIHelper } from '../UIHelper';
import { IFormatColumn, IAdaptableBlotterObject } from "../../Core/Api/Interface/AdaptableBlotterObjects";


interface FormatColumnPopupProps extends StrategyViewPopupProps<FormatColumnPopupComponent> {
    FormatColumns: Array<IFormatColumn>,
    StyleClassNames: string[]
    onAddFormatColumn: (formatColumn: IFormatColumn) => FormatColumnRedux.FormatColumnAddAction
    onEditFormatColumn: (formatColumn: IFormatColumn) => FormatColumnRedux.FormatColumnEditAction
    onShare: (entity: IAdaptableBlotterObject) => TeamSharingRedux.TeamSharingShareAction
}

class FormatColumnPopupComponent extends React.Component<FormatColumnPopupProps, EditableConfigEntityState> {

    constructor(props: FormatColumnPopupProps) {
        super(props);
        this.state = { EditedAdaptableBlotterObject: null, WizardStartIndex: 0, EditedAdaptableBlotterObjectIndex: 0 }
    }

    componentDidMount() {
        if (StringExtensions.IsNotNullOrEmpty(this.props.PopupParams)) {
            let arrayParams = this.props.PopupParams.split("|")
            if (arrayParams.length == 2 && arrayParams[0] == "New") {
                let newFormatColumn = ObjectFactory.CreateEmptyFormatColumn()
                newFormatColumn.ColumnId = arrayParams[1]
                this.onEdit(newFormatColumn)
            }
            if (arrayParams.length == 2 && arrayParams[0] == "Edit") {
                let editFormatColumn = this.props.FormatColumns.find(x => x.ColumnId == arrayParams[1])
                this.onEdit(editFormatColumn)
            }
        }
    }

    render() {
        let cssClassName: string = this.props.cssClassName + "__formatcolumn";
        let cssWizardClassName: string = StyleConstants.WIZARD_STRATEGY + "__formatcolumn";

        let infoBody: any[] = ["Format a column so it styles with the colours and font properties that you provide.", <br />, <br />, "Unlike Conditional Styles the column is ", <b>always</b>, " formatted as set and is not dependent on a rule being met."]

        let colItems: IColItem[] = [
            { Content: "Column", Size: 3 },
            { Content: "Format Style", Size: 5 },
            { Content: "", Size: 3 },
        ]
        let FormatColumns = this.props.FormatColumns.map((formatColumn: IFormatColumn, index) => {
            return <FormatColumnEntityRow
                key={index}
               cssClassName={cssClassName}
                colItems={colItems}
                AdaptableBlotterObject={formatColumn}
                Columns={this.props.Columns}
                UserFilters={null}
                Index={index}
                onEdit={(index, x) => this.onEdit(formatColumn)}
                onShare={() => this.props.onShare(formatColumn)}
                TeamSharingActivated={this.props.TeamSharingActivated}
                onDeleteConfirm={FormatColumnRedux.FormatColumnDelete(formatColumn)} />
        });

        let newButton = <ButtonNew cssClassName={cssClassName}onClick={() => this.onNew()}
            overrideTooltip="Create Format Column"
            DisplayMode="Glyph+Text"
            size={"small"} />

            return <div className={cssClassName}>
            <PanelWithButton cssClassName={cssClassName}  headerText={StrategyNames.FormatColumnStrategyName}
                button={newButton}
                bsStyle="primary" className="ab_main_popup" glyphicon={StrategyGlyphs.FormatColumnGlyph} infoBody={infoBody}>

                {this.props.FormatColumns.length == 0 &&
                    <Well bsSize="small">Click 'New' to create a new column format.</Well>
                }

                {FormatColumns.length > 0 &&
                    <AdaptableObjectCollection cssClassName={cssClassName} colItems ={colItems} items={FormatColumns} />
                }

                {this.state.EditedAdaptableBlotterObject != null &&
                    <FormatColumnWizard
                    cssClassName={cssWizardClassName}
                    EditedAdaptableBlotterObject={this.state.EditedAdaptableBlotterObject as IFormatColumn}
                        ModalContainer={this.props.ModalContainer}
                        ColorPalette={this.props.ColorPalette}
                        BlotterOptions={this.props.BlotterOptions}
                        BlotterApi={this.props.BlotterApi}
                        StyleClassNames={this.props.StyleClassNames}
                        UserFilters={this.props.UserFilters}
                        SystemFilters={this.props.SystemFilters}
                        Columns={this.props.Columns}
                        getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList}
                        ConfigEntities={this.props.FormatColumns}
                        WizardStartIndex={this.state.WizardStartIndex}
                        onCloseWizard={() => this.onCloseWizard()}
                        onFinishWizard={() => this.onFinishWizard()}
                        canFinishWizard={()=>this.canFinishWizard()}
                        />
                }
            </PanelWithButton>
        </div>
    }

    onNew() {
        this.setState({ EditedAdaptableBlotterObject: ObjectFactory.CreateEmptyFormatColumn(), WizardStartIndex: 0 });
    }

    onEdit(formatColumn: IFormatColumn) {
        let clonedObject: IFormatColumn = Helper.cloneObject(formatColumn);
        this.setState({ EditedAdaptableBlotterObject: clonedObject, WizardStartIndex: 1 });
    }

    onCloseWizard() {
        this.props.onClearPopupParams()
        this.setState({ EditedAdaptableBlotterObject: null, WizardStartIndex: 0 });
    }

    onFinishWizard() {
        let formatColumn = this.state.EditedAdaptableBlotterObject as IFormatColumn
        if (this.props.FormatColumns.find(x => x.ColumnId == formatColumn.ColumnId)) {
            this.props.onEditFormatColumn(formatColumn)
        } else {
            this.props.onAddFormatColumn(formatColumn)
        }
        this.setState({ EditedAdaptableBlotterObject: null, WizardStartIndex: 0 });
    }
    canFinishWizard() {
        let formatColumn = this.state.EditedAdaptableBlotterObject as IFormatColumn
        return StringExtensions.IsNotNullOrEmpty(formatColumn.ColumnId) &&
            UIHelper.IsNotEmptyStyle(formatColumn.Style)
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        FormatColumns: state.FormatColumn.FormatColumns,
        StyleClassNames: state.UserInterface.StyleClassNames
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onAddFormatColumn: (formatColumn: IFormatColumn) => dispatch(FormatColumnRedux.FormatColumnAdd(formatColumn)),
        onEditFormatColumn: (formatColumn: IFormatColumn) => dispatch(FormatColumnRedux.FormatColumnEdit(formatColumn)),
        onShare: (entity: IAdaptableBlotterObject) => dispatch(TeamSharingRedux.TeamSharingShare(entity, StrategyIds.FormatColumnStrategyId))
    };
}

export let FormatColumnPopup = connect(mapStateToProps, mapDispatchToProps)(FormatColumnPopupComponent);


