import {MenuItemShowPopup} from '../../Core/MenuItem'
import {AdaptableStrategyBase} from '../../Core/AdaptableStrategyBase'
import {AdaptableViewFactory} from '../../View/AdaptableViewFactory'
import * as StrategyIds from '../../Core/StrategyIds'
import {IMenuItem} from '../../Core/Interface/IStrategy';
import {IAdaptableBlotter,IColumn} from '../../Core/Interface/IAdaptableBlotter'
import {IColumnChooserStrategy} from '../../Core/Interface/IColumnChooserStrategy'

export class ColumnChooserStrategy extends AdaptableStrategyBase implements IColumnChooserStrategy {
    private menuItemConfig: IMenuItem;
    constructor(blotter: IAdaptableBlotter) {
        super(StrategyIds.ColumnChooserStrategyId, blotter)
        this.menuItemConfig = new MenuItemShowPopup("Column Chooser", this.Id, "ColumnChooserAction","list-alt");
    }

    getMenuItems(): IMenuItem[] {
        return [this.menuItemConfig];
    }
}