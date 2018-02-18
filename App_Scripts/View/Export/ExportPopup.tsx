import * as React from "react";
import * as Redux from "redux";
import { connect } from 'react-redux';
import { Well } from 'react-bootstrap';
import { PanelWithButton } from '../Components/Panels/PanelWithButton';
import { AdaptableBlotterState } from '../../Redux/Store/Interface/IAdaptableStore'
import * as ExportRedux from '../../Redux/ActionsReducers/ExportRedux'
import { ExportDestination} from '../../Core/Enums'
import { StrategyViewPopupProps } from '../Components/SharedProps/StrategyViewPopupProps'
import { IColumn, IConfigEntity } from '../../Core/Interface/IAdaptableBlotter';
import { IUserFilter } from '../../Strategy/Interface/IUserFilterStrategy';
import { IReport, ILiveReport } from "../../Strategy/Interface/IExportStrategy";
import { ButtonNew } from '../Components/Buttons/ButtonNew';
import { Helper } from '../../Core/Helpers/Helper';
import { ReportEntityRow } from './ReportEntityRow'
import { ReportWizard } from './Wizard/ReportWizard'
import { ObjectFactory } from '../../Core/ObjectFactory';
import * as TeamSharingRedux from '../../Redux/ActionsReducers/TeamSharingRedux'
import * as StrategyIds from '../../Core/Constants/StrategyIds'
import * as StrategyNames from '../../Core/Constants/StrategyNames'
import * as StrategyGlyphs from '../../Core/Constants/StrategyGlyphs'
import { EntityCollectionView } from '../Components/EntityCollectionView';
import { encode } from "punycode";
import { EditableConfigEntityState } from '../Components/SharedProps/EditableConfigEntityState';
import { IColItem } from "../Interfaces";
import { UIHelper } from '../UIHelper';

interface ExportPopupProps extends StrategyViewPopupProps<ExportPopupComponent> {
    Reports: IReport[],
    LiveReports: ILiveReport[];
    CurrentReport: string,
    onApplyExport: (value: string, exportDestination: ExportDestination) => ExportRedux.ExportApplyAction;
    onAddUpdateReport: (index: number, Report: IReport) => ExportRedux.ReportAddUpdateAction;
    onReportStopLive: (Report: string, exportDestination: ExportDestination.OpenfinExcel | ExportDestination.iPushPull) => ExportRedux.ReportStopLiveAction;
    UserFilters: IUserFilter[]
    Columns: Array<IColumn>
    onShare: (entity: IConfigEntity) => TeamSharingRedux.TeamSharingShareAction
}

class ExportPopupComponent extends React.Component<ExportPopupProps, EditableConfigEntityState> {

    constructor() {
        super();
        this.state = UIHelper.EmptyConfigState() ;
    }

    componentDidMount() {
        if (this.props.PopupParams == "New") {
            this.onNew()
        }
        if (this.props.PopupParams == "Edit") {
            let selectedReport: IReport = this.props.Reports.find(a => a.Name == this.props.CurrentReport);
            let selectedReportIndex = this.props.Reports.findIndex(a => a.Name == this.props.CurrentReport);
            this.onEdit(selectedReportIndex, selectedReport)
        }
    }

    render() {

        let infoBody: any[] = ["Export works by sending 'Reports' to specified location.", <br />, <br />, "You can use an existing Report or create one of your own..", <br />, <br />]

        let colItems: IColItem[] = [
            { Content: "Report", Size: 2 },
            { Content: "Columns", Size: 2 },
            { Content: "Query", Size: 3 },
            { Content: "", Size: 2 },
            { Content: "", Size: 3 },
        ]

        let Reports = this.props.Reports.map((Report: IReport, index) => {
            return <ReportEntityRow
                ConfigEntity={Report}
                key={index}
                ColItems={colItems}
                Index={index}
                Columns={this.props.Columns}
                IsLast={index == this.props.Reports.length - 1}
                UserFilters={this.props.UserFilters}
                LiveReports={this.props.LiveReports}
                onShare={() => this.props.onShare(Report)}
                TeamSharingActivated={this.props.TeamSharingActivated}
                onExport={(exportDestination) => this.onApplyExport(Report.Name, exportDestination)}
                onReportStopLive={(exportDestination) => this.props.onReportStopLive(Report.Name, exportDestination)}
                onEdit={(index, Report) => this.onEdit(index, Report as IReport)}
                onDeleteConfirm={ExportRedux.ReportDelete(index)}
                isDropUp={index > 1} />
        });

        let newButton = <ButtonNew onClick={() => this.onNew()}
            overrideTooltip="Create Report"
            DisplayMode="Glyph+Text"
            size={"small"} />

        return (
            <PanelWithButton headerText={StrategyNames.ExportStrategyName} bsStyle="primary" glyphicon={StrategyGlyphs.ExportGlyph} infoBody={infoBody} button={newButton} style={panelStyle}>

                {Reports.length > 0 &&
                    <EntityCollectionView ColItems={colItems} items={Reports} />
                }

                {Reports.length == 0 &&
                    <Well bsSize="small">Click 'New' to create a new Report.  A Report is named group of columns and Unique values..</Well>
                }

                {this.state.EditedConfigEntity &&
                    <ReportWizard
                        EditedConfigEntity={this.state.EditedConfigEntity as IReport}
                        ConfigEntities={this.props.Reports}
                        Columns={this.props.Columns}
                        UserFilters={this.props.UserFilters}
                        getColumnValueDisplayValuePairDistinctList={this.props.getColumnValueDisplayValuePairDistinctList}
                        WizardStartIndex={this.state.WizardStartIndex}
                        onCloseWizard={() => this.onCloseWizard()}
                        onFinishWizard={() => this.onFinishWizard()} />
                }
            </PanelWithButton>
        );
    }

    onCloseWizard() {
        this.props.onClearPopupParams()
        this.setState({ EditedConfigEntity: null, WizardStartIndex: 0, EditedIndexConfigEntity: -1, });
    }

    onFinishWizard() {
        let Report: IReport = this.state.EditedConfigEntity as IReport;
        this.props.onAddUpdateReport(this.state.EditedIndexConfigEntity, Report)
        this.setState({ EditedConfigEntity: null, WizardStartIndex: 0, EditedIndexConfigEntity: -1, });
    }

    onNew() {
        this.setState({ EditedConfigEntity: ObjectFactory.CreateEmptyReport(), WizardStartIndex: 0, EditedIndexConfigEntity: -1 })
    }

    onEdit(index: number, ReportToEdit: IReport) {
        let clonedReportToEdit = Helper.cloneObject(ReportToEdit)
        this.setState({ EditedConfigEntity: clonedReportToEdit, WizardStartIndex: 0, EditedIndexConfigEntity: index })
    }

    onApplyExport(Report: string, exportDestination: ExportDestination) {
        this.props.onApplyExport(Report, exportDestination);
    }
}

function mapStateToProps(state: AdaptableBlotterState, ownProps: any) {
    return {
        Reports: state.Export.Reports,
        CurrentReport: state.Export.CurrentReport,
        LiveReports: state.Export.CurrentLiveReports,
        Columns: state.Grid.Columns,
        UserFilters: state.UserFilter.UserFilters,
    };
}

function mapDispatchToProps(dispatch: Redux.Dispatch<AdaptableBlotterState>) {
    return {
        onApplyExport: (value: string, exportDestination: ExportDestination) => dispatch(ExportRedux.ExportApply(value, exportDestination)),
        onAddUpdateReport: (Index: number, Report: IReport) => dispatch(ExportRedux.ReportAddUpdate(Index, Report)),
        onReportStopLive: (Report: string, exportDestination: ExportDestination.OpenfinExcel | ExportDestination.iPushPull) => dispatch(ExportRedux.ReportStopLive(Report, exportDestination)),
        onShare: (entity: IConfigEntity) => dispatch(TeamSharingRedux.TeamSharingShare(entity, StrategyIds.ExportStrategyId))
    };
}

export let ExportPopup = connect(mapStateToProps, mapDispatchToProps)(ExportPopupComponent);


let panelStyle = {
    width: '800px',
}

