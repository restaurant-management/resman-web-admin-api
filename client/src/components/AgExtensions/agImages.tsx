import { ILoadingCellRendererParams } from '@ag-grid-community/all-modules';
import React, { Component } from 'react';
export class AgImages extends Component<ILoadingCellRendererParams> {
    public render() {
        return (
            <img
                data-tip='React-tooltip'
                src={this.props.value[0]}
                width={20} height={20}
                alt=''
            />
        );
    }
}
