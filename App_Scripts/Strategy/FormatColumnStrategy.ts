import { AdaptableStrategyBase } from './AdaptableStrategyBase'
import * as StrategyIds from '../Core/Constants/StrategyIds'
import * as StrategyNames from '../Core/Constants/StrategyNames'
import * as StrategyGlyphs from '../Core/Constants/StrategyGlyphs'
import * as ScreenPopups from '../Core/Constants/ScreenPopups'
import { IAdaptableBlotter } from '../Core/Interface/IAdaptableBlotter'
import { IFormatColumnStrategy } from './Interface/IFormatColumnStrategy'
import { FormatColumnState } from '../Redux/ActionsReducers/Interface/IState';
import { ArrayExtensions } from '../Core/Extensions/ArrayExtensions';


export abstract class FormatColumnStrategy extends AdaptableStrategyBase implements IFormatColumnStrategy {
    protected FormatColumnState: FormatColumnState
    constructor(blotter: IAdaptableBlotter) {
        super(StrategyIds.FormatColumnStrategyId, blotter)
    }

    protected addPopupMenuItem() {
        this.createMenuItemShowPopup(StrategyNames.FormatColumnStrategyName, ScreenPopups.FormatColumnPopup, StrategyGlyphs.FormatColumnGlyph);
    }

    protected addColumnMenuItem(columnId: string): void {
        let formatExists: boolean = ArrayExtensions.ContainsItem(this.FormatColumnState.FormatColumns.map(f=>f.ColumnId), columnId)
        let label = formatExists ? "Edit " : "Create "
        let popupParam = formatExists ? "Edit|" : "New|"

        this.createContextMenuItemShowPopup(
            label + StrategyNames.FormatColumnStrategyName,
            ScreenPopups.FormatColumnPopup,
            StrategyGlyphs.FormatColumnGlyph,
            popupParam + columnId)

    }

    protected InitState() {
        if (this.FormatColumnState != this.blotter.AdaptableBlotterStore.TheStore.getState().FormatColumn) {
            this.FormatColumnState = this.blotter.AdaptableBlotterStore.TheStore.getState().FormatColumn;

            this.InitStyles();
        }
    }

    protected abstract InitStyles(): void;
}