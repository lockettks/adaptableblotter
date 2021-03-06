import * as React from "react";
import * as Redux from "redux";
import { connect } from 'react-redux';
import { Well } from 'react-bootstrap';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as CustomSortRedux from '../../Redux/ActionsReducers/CustomSortRedux'
import * as PopupRedux from '../../Redux/ActionsReducers/PopupRedux'
import * as TeamSharingRedux from '../../Redux/ActionsReducers/TeamSharingRedux'
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as StrategyGlyphs from '../../Core/Constants/StrategyGlyphs'
import { StrategyViewPopupProps } from '../Components/SharedProps/StrategyViewPopupProps'
import { IColumn } from '../../Core/Interface/IColumn';
import { Helper } from '../../Core/Helpers/Helper';
import { ObjectFactory } from '../../Core/ObjectFactory';
import { CustomSortEntityRow } from './CustomSortEntityRow'
import { CustomSortWizard } from './Wizard/CustomSortWizard'
import { PanelWithButton } from '../Components/Panels/PanelWithButton';
import { ButtonNew } from '../Components/Buttons/ButtonNew';
import { StringExtensions } from '../../Core/Extensions/StringExtensions'
import { AdaptableObjectCollection } from '../Components/AdaptableObjectCollection';
import { EditableConfigEntityState } from '../Components/SharedProps/EditableConfigEntityState';
import * as GeneralConstants from '../../Core/Constants/GeneralConstants';
import { IColItem } from "../UIInterfaces";
import { UIHelper } from '../UIHelper';
import * as StyleConstants from '../../Core/Constants/StyleConstants';
import { ICustomSort, IAdaptableBlotterObject } from "../../Core/Api/Interface/AdaptableBlotterObjects";
import { ArrayExtensions } from "../../Core/Extensions/ArrayExtensions";
import { ColumnHelper } from "../../Core/Helpers/ColumnHelper";

interface CustomSortPopupProps extends StrategyViewPopupProps<CustomSortPopupComponent> {
    onAddCustomSort: (customSort: ICustomSort) => CustomSortRedux.CustomSortAddAction
    onEditCustomSort: (customSort: ICustomSort) => CustomSortRedux.CustomSortEditAction
    CustomSorts: Array<ICustomSort>
    onShare: (entity: IAdaptableBlotterObject) => TeamSharingRedux.TeamSharingShareAction
}

class CustomSortPopupComponent extends React.Component<CustomSortPopupProps, EditableConfigEntityState> {
    constructor(props: CustomSortPopupProps) {
        super(props);
        this.state = UIHelper.EmptyConfigState();
    }

    componentDidMount() {
        if (StringExtensions.IsNotNullOrEmpty(this.props.PopupParams)) {
            let arrayParams = this.props.PopupParams.split("|")
            if (arrayParams.length == 2 && arrayParams[0] == "New") {
                let newCustomSort = ObjectFactory.CreateEmptyCustomSort()
                newCustomSort.ColumnId = arrayParams[1]
                this.onEdit(newCustomSort)
            }
            if (arrayParams.length == 2 && arrayParams[0] == "Edit") {
                let editCustomSort = this.props.CustomSorts.find(x => x.ColumnId == arrayParams[1])
                this.onEdit(editCustomSort)
            }
        }
    }

    render() {
        let cssClassName: string = this.props.cssClassName + "__customsort";
        let cssWizardClassName: string = StyleConstants.WIZARD_STRATEGY + "__customsort";

        let infoBody: any[] = ["Custom Sorts enable you to create your own sort orders for columns where the default (alphabetical ascending or descending) is insufficient.", <br />, <br />,
            "Use the Wizard to specify and order the column values in the Sort.", <br />, <br />,
            "A Custom Sort can contain as many column values as required; any values not contained in the Custom Sort will be sorted alphabetically ", <strong>after</strong>, " the sort order has been applied."]

        let colItems: IColItem[] = [
            { Content: "Column", Size: 3 },
            { Content: "Sort Order", Size: 7 },
            { Content: "", Size: 2 },
        ]

        let customSorts = this.props.CustomSorts.map((customSort: ICustomSort, index) => {
            return <CustomSortEntityRow
                cssClassName={cssClassName}
                colItems={colItems}
                AdaptableBlotterObject={customSort}
                key={customSort.ColumnId}
                Index={index}
                onEdit={(index, customSort) => this.onEdit(customSort as ICustomSort)}
                TeamSharingActivated={this.props.TeamSharingActivated}
                onShare={() => this.props.onShare(customSort)}
                onDeleteConfirm={CustomSortRedux.CustomSortDelete(customSort)}
                ColumnLabel={ColumnHelper.getFriendlyNameFromColumnId(customSort.ColumnId, this.props.Columns)}
            />
        });

        let newButton = <ButtonNew cssClassName={cssClassName} onClick={() => this.onNew()}
            overrideTooltip="Create Custom Sort"
            DisplayMode="Glyph+Text"
            size={"small"} />

        return <div className={cssClassName}>
            <PanelWithButton cssClassName={cssClassName} headerText={StrategyNames.CustomSortStrategyName} className="ab_main_popup" infoBody={infoBody}
                button={newButton} bsStyle="primary" glyphicon={StrategyGlyphs.CustomSortGlyph}>

                {customSorts.length > 0 &&
                    <AdaptableObjectCollection cssClassName={cssClassName} colItems={colItems} items={customSorts} />
                }

                {customSorts.length == 0 &&
                    <Well bsSize="small">Click 'New' to create a bespoke sort order for a selected column.</Well>
                }

                {this.state.EditedAdaptableBlotterObject &&
                    <CustomSortWizard
                        cssClassName={cssWizardClassName}
                        EditedAdaptableBlotterObject={this.state.EditedAdaptableBlotterObject as ICustomSort}
                        ConfigEntities={this.props.CustomSorts}
                        BlotterOptions={this.props.BlotterOptions}
                        BlotterApi={this.props.BlotterApi}
                        ModalContainer={this.props.ModalContainer}
                        Columns={this.props.Columns}
                        UserFilters={this.props.UserFilters}
                        SystemFilters={this.props.SystemFilters}
                        getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList}
                        WizardStartIndex={this.state.WizardStartIndex}
                        onCloseWizard={() => this.onCloseWizard()}
                        onFinishWizard={() => this.onFinishWizard()}
                        canFinishWizard={() => this.canFinishWizard()}
                    />
                }
            </PanelWithButton>
        </div>
    }

    onEdit(customSort: ICustomSort) {
        //so we dont mutate original object
        this.setState({ EditedAdaptableBlotterObject: Helper.cloneObject(customSort), WizardStartIndex: 1 });
    }

    onNew() {
        this.setState({ EditedAdaptableBlotterObject: ObjectFactory.CreateEmptyCustomSort(), WizardStartIndex: 0 });
    }

    onCloseWizard() {
        this.props.onClearPopupParams()
        this.setState({ EditedAdaptableBlotterObject: null, WizardStartIndex: 0, EditedAdaptableBlotterObjectIndex: -1, });
    }

    onFinishWizard() {
        let customSort: ICustomSort = this.state.EditedAdaptableBlotterObject as ICustomSort;
        if (this.props.CustomSorts.find(x => x.ColumnId == customSort.ColumnId)) {
            this.props.onEditCustomSort(customSort)
        }
        else {
            this.props.onAddCustomSort(customSort)
        }
        this.setState({ EditedAdaptableBlotterObject: null, WizardStartIndex: 0, EditedAdaptableBlotterObjectIndex: -1, });
    }

    canFinishWizard() {
        let customSort = this.state.EditedAdaptableBlotterObject as ICustomSort
        return StringExtensions.IsNotNullOrEmpty(customSort.ColumnId) && ArrayExtensions.IsNotNullOrEmpty(customSort.SortedValues);
    }

}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        CustomSorts: state.CustomSort.CustomSorts,
    };
}


function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onAddCustomSort: (customSort: ICustomSort) => dispatch(CustomSortRedux.CustomSortAdd(customSort)),
        onEditCustomSort: (customSort: ICustomSort) => dispatch(CustomSortRedux.CustomSortEdit(customSort)),
        onClearPopupParams: () => dispatch(PopupRedux.PopupClearParam()),
        onShare: (entity: IAdaptableBlotterObject) => dispatch(TeamSharingRedux.TeamSharingShare(entity, StrategyIds.CustomSortStrategyId))
    };
}

export let CustomSortPopup = connect(mapStateToProps, mapDispatchToProps)(CustomSortPopupComponent);
