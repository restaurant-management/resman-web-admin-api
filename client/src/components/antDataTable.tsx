import { Popconfirm, Table } from 'antd';
import { ColumnProps } from 'antd/lib/table';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { selectStyle } from '../utils/selectStyles';
import { AgActions } from './AgExtensions/agActions';
import OverlayIndicator from './overlayIndicator';

interface DataTableProp<T> {
    loading?: boolean;
    pageSizeList?: number[];
    defaultPageSizeIndex?: number;
    data: T[];
    columnDefs?: Array<ColumnProps<T>>;
    exportFileName?: string;
    autoSizeColumns?: string[];
    header?: JSX.Element;
    onCreate?: () => void;
    onView?: (item: T) => void;
    onDelete?: (item: T) => void;
    onMultiDelete?: (items: T[]) => void;
    onEdit?: (item: T) => void;
    getSelected?: () => T[];
    onReload?: (callback?: () => void) => void;
}

interface DataTableState {
    pagingSelected: { value: number, label: string };
    reloading: boolean;
    selectedRowKeys: any;
}

export class AntDataTable<T> extends Component<DataTableProp<T>, DataTableState> {

    private _pageSizeOptions = (this.props.pageSizeList || [10, 25, 50, 100]).map(value => ({
        value,
        label: `${value} rows/page`
    }));

    constructor(props: any) {
        super(props);
        this.state = {
            pagingSelected: this._pageSizeOptions[this.props.defaultPageSizeIndex || 1],
            reloading: false,
            selectedRowKeys: []
        };
    }

    public onSelectChange = (selectedRowKeys: any) => {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    }

    public render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            selections: [
                {
                    key: 'odd',
                    text: 'Select Odd Row',
                    onSelect: (changableRowKeys: string[]) => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return false;
                            }

                            return true;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
                {
                    key: 'even',
                    text: 'Select Even Row',
                    onSelect: (changableRowKeys: string[]) => {
                        let newSelectedRowKeys = [];
                        newSelectedRowKeys = changableRowKeys.filter((key, index) => {
                            if (index % 2 !== 0) {
                                return true;
                            }

                            return false;
                        });
                        this.setState({ selectedRowKeys: newSelectedRowKeys });
                    },
                },
            ],
        };

        return (
            <section className='tile color transparent-black'>
                <OverlayIndicator show={this.state.reloading || this.props.loading} />
                <ReactTooltip place='top' type='dark' effect='solid' />
                <div className='tile-header'>
                    <div className='row' style={{ paddingTop: 10 }}>
                        <div className='col-md-6'>
                            {this.props.header || (<h1><strong>{this.props.exportFileName}</strong> Table</h1>)}
                        </div>
                        <div className='col-md-4'>
                            <div style={{ float: 'right' }}>
                                <button
                                    data-tip='Export to CSV'
                                    onClick={this._export.bind(this)}
                                    className='resman-btn resman-cyan resman-left-border-radius'
                                >
                                    <i className='fa fa-download' />
                                    <span> Export</span>
                                </button>
                                <button
                                    data-tip='Add new'
                                    onClick={this.props.onCreate}
                                    className={`resman-btn resman-success ${this.props.onMultiDelete ? 'resman-no-border-radius' : 'resman-right-border-radius'}`}
                                >
                                    <i className='fa fa-plus' />
                                    <span> Add</span>
                                </button>
                                {this.props.onMultiDelete && (
                                    <Popconfirm
                                        placement='top'
                                        title={'Are you sure to delete all selected rows?'}
                                        onConfirm={() => { console.log('confirm'); }}
                                        okText='Yes'
                                        cancelText='No'
                                    >
                                        <button
                                            data-tip='Delete all selected rows'
                                            className='resman-btn resman-danger resman-right-border-radius'
                                        >
                                            <i className='fa fa-trash-o' />{` Delete`}
                                        </button>
                                    </Popconfirm>
                                )}
                            </div>
                        </div>
                        <div className='col-md-2'>
                            <Select
                                styles={selectStyle}
                                onChange={(value: any) => {
                                    this.setState({ pagingSelected: value });
                                }}
                                isSearchable
                                value={this.state.pagingSelected}
                                options={this._pageSizeOptions}
                            />
                        </div>
                    </div>
                    <div className='controls'>
                        <Link to='#' className='minimize'>
                            <i className='fa fa-chevron-down' />
                        </Link>
                        <Link onClick={(_) => this._reload()} to='#'>
                            <i className='fa fa-refresh' />
                        </Link>
                        <Link to='#' className='remove'><i className='fa fa-times' /></Link>
                    </div>
                </div>
                <div className='tile-widget'>
                    <Table bordered columns={[...this.props.columnDefs, {
                        title: 'Action',
                        key: 'operation',
                        fixed: 'right',
                        width: 150,
                        render: () => this._renderActions()
                    }]} dataSource={this.props.data} rowSelection={rowSelection} />
                </div>
            </section>
        );
    }

    private _reload() {
        this.setState({ reloading: true });
        console.log('reload');
        if (this.props.onReload) {
            this.props.onReload(() => this.setState({ reloading: false }));
        }
    }

    private _export() {
        console.log('export');
    }

    private _renderActions() {
        const style = { paddingLeft: 15, paddingRight: 15, paddingTop: 2, paddingBottom: 2 };

        return (<span>
            {this.props.onView && (
                <button
                    data-tip='Export to CSV'
                    className='resman-btn resman-cyan resman-left-border-radius'
                    style={style}
                >
                    <i className='fa fa-eye' />
                </button>
            )}
            <button
                className={`resman-btn resman-warning ${this.props.onView ? 'resman-no-border-radius' : 'resman-left-border-radius'}`}
                style={style}
            >
                <i className='fa fa-pencil' />
            </button>
            <Popconfirm
                placement='top'
                title={'Are you sure?'}
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
        </span>);
    }
}
