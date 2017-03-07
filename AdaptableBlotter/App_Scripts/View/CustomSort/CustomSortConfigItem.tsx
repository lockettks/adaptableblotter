import { ICustomSort } from '../../Core/Interface/ICustomSortStrategy';
/// <reference path="../../../typings/index.d.ts" />

import * as React from "react";
import { Button, Col, Row, ButtonGroup, Panel } from 'react-bootstrap';
import { EntityListActionButtons } from '../EntityListActionButtons';

interface CustomSortConfigItemProps extends React.ClassAttributes<CustomSortConfigItem> {
    CustomSort: ICustomSort
    ColumnLabel: string
    onEdit: (CustomSort: ICustomSort) => void;
    onDeleteConfirm: Redux.Action;
}


export class CustomSortConfigItem extends React.Component<CustomSortConfigItemProps, {}> {
    render(): any {
        return <li
            className="list-group-item"
            onClick={() => { } }>
            <Row style={{ display: "flex", alignItems: "center" }}>
                <Col xs={3}>{this.props.ColumnLabel}</Col>
                <Col xs={6} >
                    {this.props.CustomSort.CustomSortItems.join(', ')}
                </Col>
                <Col xs={3}>
                    <EntityListActionButtons
                        ConfirmDeleteAction={this.props.onDeleteConfirm}
                        editClick={() => this.props.onEdit(this.props.CustomSort)}
                        ConfigEntity={this.props.CustomSort}>
                    </EntityListActionButtons>
                </Col>
            </Row>
        </li>
    }
}