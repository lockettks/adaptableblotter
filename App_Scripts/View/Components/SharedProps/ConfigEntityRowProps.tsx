import * as React from "react";
/// <reference path="../../typings/.d.ts" />
import * as Redux from "redux";
import { IColumn  } from '../../../Core/Interface/IColumn';
import { IUserFilter, IAdaptableBlotterObject } from '../../../Core/Api/Interface/AdaptableBlotterObjects';
import { IColItem } from "../../UIInterfaces";


// base props
export interface BaseRowProps<View> extends React.ClassAttributes<View> {
     colItems: IColItem[]
    cssClassName: string
}

export interface BaseEntityRowProps<View> extends BaseRowProps<View> {
    AdaptableBlotterObject: IAdaptableBlotterObject
    onDeleteConfirm: Redux.Action;
    Index: number
    onEdit: (index: number, adaptableBlotterObject: IAdaptableBlotterObject) => void;
}

// shared props
export interface SharedEntityRowProps<View> extends BaseEntityRowProps<View> {
    onShare: () => void;
    TeamSharingActivated: boolean
}

// Expression props
export interface ExpressionEntityRowProps<View> extends BaseEntityRowProps<View> {
    Columns: IColumn[]
    UserFilters: IUserFilter[]
}

// Shared and Expression Props
export interface SharedEntityExpressionRowProps<View> extends SharedEntityRowProps<View> {
    Columns: IColumn[]
    UserFilters: IUserFilter[]
}
