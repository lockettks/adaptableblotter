import { BlotterApiBase } from "../../Core/Api/BlotterApiBase";
import { AdaptableBlotter } from "./AdaptableBlotter";
import { IBlotterApi } from "../../Core/Api/Interface/IBlotterApi";


export class BlotterApi extends BlotterApiBase implements IBlotterApi {

    constructor( blotter : AdaptableBlotter) {
        super(blotter)
         this.blotter = blotter;
    }

    public setGridData(dataSource: any): void {
        // todo
    }
}