import { ICellRendererParams } from '@ag-grid-community/all-modules';
import React, { Component } from 'react';

interface AgActionsProp extends ICellRendererParams {
    onView?: (data: any) => void;
    onEdit?: (data: any) => void;
    onDelete?: (data: any) => void;
}

export class AgActions extends Component<AgActionsProp, any> {
    public render() {
        const style = { paddingLeft: 15, paddingRight: 15, paddingTop: 2, paddingBottom: 2 };

        return (
            <span>
                <button
                    data-tip='Export to CSV'
                    className='resman-btn resman-cyan resman-left-border-radius'
                    style={style}
                    onClick={() => {
                        if (this.props.onView) {
                            this.props.onView(this.props.data);
                        }
                    }}
                >
                    <i className='fa fa-eye'></i>
                </button>
                <button
                    className='resman-btn resman-warning resman-no-border-radius'
                    style={style}
                    onClick={() => {
                        if (this.props.onEdit) {
                            this.props.onEdit(this.props.data);
                        }
                    }}
                >
                    <i className='fa fa-pencil'></i>
                </button>
                <button
                    className='resman-btn resman-danger resman-right-border-radius'
                    style={style}
                    onClick={() => {
                        if (this.props.onDelete) {
                            this.props.onDelete(this.props.data);
                        }
                    }}
                >
                    <i className='fa fa-trash-o'></i>
                </button>
            </span>
        );
    }
}
