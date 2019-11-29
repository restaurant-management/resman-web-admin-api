import React, { Component } from 'react';
import { LoadScriptFile } from '../utils/loadScript';

export interface BasicDatatableProp<T> {
    readonly hideTitle?: boolean;
    readonly hideActions?: boolean;
    readonly title?: string;
    readonly subtitle?: string;
    readonly data?: T[];
    readonly columns?: DataTableColumn[];
    readonly onMinimize?: () => void;
}

export interface DataTableColumn {
    id?: string;
    label: string;
    sortType?: SortType;
    textCenter?: boolean;
    type?: 'string' | 'image' | 'date';
}

export type SortType = 'sort-alpha' | 'sort-amount' | 'sort-numeric';

export default class BasicDatatable<T> extends Component<BasicDatatableProp<T>> {
    constructor(props: BasicDatatableProp<T>) {
        super(props);
        this.state = {

        };
    }

    public componentDidMount() {
        // Advanced Table.
        LoadScriptFile('/assets/js/chosen.jquery.min.js');

        // Basic Datatable.
        LoadScriptFile('/assets/js/jquery.dataTables.min.js');
        LoadScriptFile('/assets/js/dataTable.js');
    }

    public render() {
        const titleEle = !this.props.hideTitle && (
            <div className='tile-header transparent'>
                <h1>{this.props.title}</h1>
                {this.props.subtitle && (<span className='note'>{this.props.subtitle}</span>)}
                <div className='controls'>
                    <a href='#/' onClick={this._onMinimize.bind(this)} className='minimize'>
                        <i className='fa fa-chevron-down' />
                    </a>
                    <a href='#/' className='refresh'><i className='fa fa-refresh' /></a>
                    <a href='#/' className='remove'><i className='fa fa-times' /></a>
                </div>
            </div>);

        return (
            <section className='tile transparent'>
                {titleEle}
                <div className='tile-body color transparent-black rounded-corners'>
                    <div className='table-responsive'>
                        <table className='table table-datatable table-custom' id='basicDataTable'>
                            <thead>
                                <tr>
                                    {
                                        this.props.columns && this.props.columns.map((column, index) =>
                                            column.sortType ? (
                                                <th
                                                    key={index.toString()}
                                                    id={column.id || column.label}
                                                    className={column.sortType}
                                                >
                                                    {column.label}
                                                </th>
                                            ) : (
                                                    <th key={index.toString()} className={'no-sort'}>{column.label}</th>
                                                )
                                        )
                                    }
                                    {!this.props.hideActions && (
                                        <th
                                            key={this.props.columns ? this.props.columns.length.toString() : '0'}
                                            className={'no-sort'}
                                        >
                                            Actions
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.data && this.props.data.map((item: any, index: number) => (
                                        <tr key={index.toString()} className={index % 2 === 0 ? 'odd' : 'even'}>
                                            {
                                                this.props.columns && this.props.columns.map((column, i) => (
                                                    <td key={i.toString()}
                                                        className={column.textCenter ? 'text-center' : ''}>
                                                        {column.type === 'image' ? (
                                                            <img
                                                                src={item[column.id || column.label]}
                                                                width={20} height={20}
                                                                alt=''
                                                            />
                                                        ) : column.type === 'date' ?
                                                                item[column.id || column.label].toUTCString()
                                                                : item[column.id || column.label]}
                                                    </td>
                                                ))
                                            }
                                            {!this.props.hideActions && (
                                                <td
                                                    key={this.props.columns ?
                                                        this.props.columns.length.toString() : '0'}
                                                    className='actions text-center'
                                                >
                                                    <a className='edit' href='#/'>Edit</a>
                                                    <a className='delete' href='#/'>Delete</a>
                                                </td>
                                            )}
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        );
    }

    private _onMinimize() {
        console.log('Minimize');
    }
}
