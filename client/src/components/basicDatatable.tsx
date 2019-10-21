import React, { Component } from 'react';

export interface BasicDatatableProps {
    readonly hideTitle?: boolean;
    readonly title?: string;
    readonly subtitle?: string;
    readonly data?: any[];
    readonly columns?: DataTableColumn;
}

export type DataTableColumn = Array<{
    id?: string,
    label: string,
    sortType?: SortType,
    textCenter?: boolean,
    type?: 'string' | 'image'
}>;

export type SortType = 'sort-alpha' | 'sort-amount' | 'sort-numeric';

export default class BasicDatatable extends Component<BasicDatatableProps> {
    constructor(props: BasicDatatableProps) {
        super(props);
        this.state = {

        };
    }

    public render() {
        const titleEle = !this.props.hideTitle && (
            <div className='tile-header transparent'>
                <h1>{this.props.title}</h1>
                {this.props.subtitle && (<span className='note'>{this.props.subtitle}</span>)}
                <div className='controls'>
                    <a href='#/' className='minimize'><i className='fa fa-chevron-down' /></a>
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
                                        this.props.columns && this.props.columns.map(column => column.sortType ? (
                                            <th id={column.id || column.label} className={column.sortType}>
                                                {column.label}
                                            </th>
                                        ) :
                                            (
                                                <th>{column.label}</th>
                                            )
                                        )
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.props.data && this.props.data.map((item: any, index: number) => (
                                        <tr className={index % 2 === 0 ? 'odd' : 'even'}>
                                            {
                                                this.props.columns && this.props.columns.map(column => (
                                                    <td className={column.textCenter ? 'text-center' : ''}>
                                                        {column.type === 'image' ? (
                                                            <img
                                                                src={item[column.id || column.label]}
                                                                width={20} height={20}
                                                                alt=''
                                                            />
                                                        ) : item[column.id || column.label]}
                                                    </td>
                                                ))
                                            }
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
}
