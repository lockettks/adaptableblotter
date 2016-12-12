﻿/// <reference path="../../../typings/index.d.ts" />
import * as React from "react";
import { IAdaptableBlotter } from '../../Core/Interface/IAdaptableBlotter';
import { Form, FormControl, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IAdvancedSearch } from '../../Core/Interface/IAdvancedSearchStrategy';


interface AdvancedSearchToolbarControlProps extends React.ClassAttributes<AdvancedSearchToolbarControl> {
    Blotter: IAdaptableBlotter;
    AdvancedSearches: IAdvancedSearch[];
    onSelectAdvancedSearch: (AdvancedSearchText: string) => void;
}


export class AdvancedSearchToolbarControl extends React.Component<AdvancedSearchToolbarControlProps, {}> {

    render(): any {

        let advancedSearches = this.props.AdvancedSearches.map(x => {
            return <option value={x.Uid} key={x.Uid}>{x.Name}</option>
        })

        let currentAdvancedSearchId: string = this.props.Blotter.AdaptableBlotterStore.TheStore.getState().AdvancedSearch.CurrentAdvancedSearchId;
        let savedSearch: IAdvancedSearch = this.props.AdvancedSearches.find(s => s.Uid == currentAdvancedSearchId);
        let currentAdvancedSearch: string = savedSearch != null ? savedSearch.Uid : "select";

        return (
            <Form className='navbar-form'>
                <FormControl componentClass="select" placeholder="select"
                    value={currentAdvancedSearch}
                    onChange={(x) => this.onSelectedSearchChanged(x)} >
                    <option value="select" key="select">Select Advanced Search</option>
                    {advancedSearches}
                </FormControl>


                {' '}
                <OverlayTrigger overlay={<Tooltip id="tooltipEdit">Clear Advanced Search</Tooltip>}>
                    <Button bsSize='small' onClick={() => this.onClearAdvancedSearch()}>Clear</Button>
                </OverlayTrigger>

            </Form>

        );
    }

    onSelectedSearchChanged(event: React.FormEvent) {
        let e = event.target as HTMLInputElement;
        let advancedSearchId = (e.value == "select") ? "" : e.value;
        this.props.onSelectAdvancedSearch(advancedSearchId);
        this.setState(this.state)
    }

    onClearAdvancedSearch() {
        this.props.onSelectAdvancedSearch("");
         this.setState(this.state)
    }
}
