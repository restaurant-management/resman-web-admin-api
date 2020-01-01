import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { Popconfirm } from 'antd';
import React, { Component } from 'react';

interface AgActionsProp extends ICellRendererParams {
    onView?: (data: any) => void;
    onEdit?: (data: any) => void;
    onDelete?: (data: any) => void;
    confirmDeleteTitle?: string;
}

export class AgActions extends Component<AgActionsProp, any> {
    public render() {
        const style = { paddingLeft: 15, paddingRight: 15, paddingTop: 2, paddingBottom: 2 };

        return (
            <span>
                {this.props.onView && (
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
                        <i className='fa fa-eye' />
                    </button>
                )}
                <button
                    className={`resman-btn resman-warning ${this.props.onView ? 'resman-no-border-radius' : 'resman-left-border-radius'}`}
                    style={style}
                    onClick={() => {
                        if (this.props.onEdit) {
                            this.props.onEdit(this.props.data);
                        }
                    }}
                >
                    <i className='fa fa-pencil' />
                </button>
                <Popconfirm
                    placement='top'
                    title={this.props.confirmDeleteTitle || 'Are you sure?'}
                    onConfirm={() => {
                        if (this.props.onDelete) {
                            this.props.onDelete(this.props.data);
                        }
                    }}
                    okText='Yes'
                    cancelText='No'
                >
                    <button
                        className='resman-btn resman-danger resman-right-border-radius'
                        style={style}
                    >
                        <i className='fa fa-trash-o' />
                    </button>
                </Popconfirm>
            </span>
        );
    }
}
