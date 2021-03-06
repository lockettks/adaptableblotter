import { IAdaptableBlotter } from '../Interface/IAdaptableBlotter';
import { AB_HEADER } from '../Constants/StyleConstants';

export module StyleHelper {

    export function CreateStyleName(strategyId: string, blotter: IAdaptableBlotter): string {
        return AB_HEADER + strategyId + "-" + blotter.BlotterOptions.blotterId.trim().replace(/\s/g, "")
    }

    export function CreateIndexedStyleName(strategyId: string, index: number, blotter: IAdaptableBlotter): string {
        return AB_HEADER + strategyId + "-" + index + "-" + blotter.BlotterOptions.blotterId.trim().replace(/\s/g, "")
    }

}