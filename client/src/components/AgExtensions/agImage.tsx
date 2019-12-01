import { ILoadingCellRendererParams } from '@ag-grid-community/all-modules';
import React, { Component } from 'react';
export class AgImage extends Component<ILoadingCellRendererParams> {
    public render() {
        return (
            <img
                data-tip='React-tooltip'
                src={this.props.value}
                width={20} height={20}
                alt=''
            />
        );
    }
}
