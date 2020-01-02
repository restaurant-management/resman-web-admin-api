import { AllCommunityModules, ColDef, ColGroupDef, GridOptions } from '@ag-grid-community/all-modules';
import { AgGridReact } from '@ag-grid-community/react';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import ReactTooltip from 'react-tooltip';
import { selectStyle } from '../utils/selectStyles';
import { AgActions } from './AgExtensions/agActions';
import { AgImage } from './AgExtensions/agImage';
import { AgImageTooltip } from './AgExtensions/agImageTooltip';
import OverlayIndicator from './overlayIndicator';
import { Popconfirm } from 'antd';

interface DataTableProp<T> {
    loading?: boolean;
    pageSizeList?: number[];
    defaultPageSizeIndex?: number;
    data: T[];
    columnDefs?: Array<ColDef | ColGroupDef>;
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
}

export class DataTable<T> extends Component<DataTableProp<T>, DataTableState> {

    public gridOptions: GridOptions;

    private _pageSizeOptions = (this.props.pageSizeList || [10, 25, 50, 100]).map(value => ({
        value,
        label: `${value} rows/page`
    }));

    constructor(props: any) {
        super(props);
        this.state = {
            pagingSelected: this._pageSizeOptions[this.props.defaultPageSizeIndex || 1],
            reloading: false
        };

        this.gridOptions = {
            pagination: true,
            paginationPageSize: this.state.pagingSelected.value,
            rowSelection: 'multiple',
            unSortIcon: true,
            animateRows: true,
            rowHeight: 32,
            sideBar: true,
            floatingFilter: true,
            components: { AgImageTooltip },
            suppressRowClickSelection: true,
            onFirstDataRendered: (params) => {
                if (this.props.autoSizeColumns) {
                    params.columnApi.autoSizeColumns(this.props.autoSizeColumns);
                }
            }
        };
    }

    public render() {
        return (
            <section className='tile color transparent-black'>
                <OverlayIndicator show={this.state.reloading || this.props.loading} />
                <ReactTooltip place='top' type='dark' effect='solid' />
                <div className='tile-header'>
                    <div className='row' style={{ paddingTop: 10 }}>
                        <div className='col-md-6'>
                            {this.props.header}
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
                                    className={`resman-btn resman-success ${ this.props.onMultiDelete ? 'resman-no-border-radius' : 'resman-right-border-radius'}`}
                                >
                                    <i className='fa fa-plus' />
                                    <span> Add</span>
                                </button>
                                {this.props.onMultiDelete && (
                                    <Popconfirm
                                        placement='top'
                                        title={'Are you sure to delete all selected rows?'}
                                        onConfirm={() => {
                                            if (this.props.onMultiDelete && this.gridOptions.api) {
                                                this.props.onMultiDelete(this.gridOptions.api.getSelectedRows());
                                            }
                                        }}
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
                                    if (this.gridOptions.api) {
                                        this.gridOptions.api.paginationSetPageSize(value.value);
                                    }
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
                    <div
                        className='ag-theme-balham-dark'
                        style={{
                            height: '100%',
                            width: '100%'
                        }}
                    >
                        <AgGridReact
                            multiSortKey={'ctrl'}
                            gridOptions={this.gridOptions}
                            domLayout={'autoHeight'}
                            onGridReady={(params) => {
                                params.api.sizeColumnsToFit();
                            }}
                            onGridSizeChanged={(params) => {
                                params.api.sizeColumnsToFit();
                            }}
                            defaultColDef={{
                                resizable: true,
                                suppressSizeToFit: false,
                                suppressAutoSize: false,
                                sortable: true,
                                filter: true
                            }}
                            columnDefs={(this.props.columnDefs || []).concat({
                                headerName: 'Actions',
                                cellClass: 'grid-cell-center',
                                field: 'actions',
                                cellRenderer: 'AgActions',
                                cellRendererParams: {
                                    onView: this.props.onView,
                                    onEdit: this.props.onEdit,
                                    onDelete: this.props.onDelete
                                },
                                pinned: 'right',
                                filter: false,
                                minWidth: 150,
                                maxWidth: 200,
                                sortable: false
                            })}
                            rowData={this.props.data}
                            modules={AllCommunityModules}
                            frameworkComponents={{ AgActions, AgImage }}
                        />
                    </div>
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
        if (this.gridOptions.api) {
            this.gridOptions.api.exportDataAsCsv({
                fileName: `Resman - ${this.props.exportFileName}`
            });
        }
    }
}
