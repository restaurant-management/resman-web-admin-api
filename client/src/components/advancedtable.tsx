import React, { Component } from 'react';
class AdvancedTable extends Component {
    public render() {
        return (
            <section className='tile color transparent-black'>
                <div className='tile-header'>
                    <h1><strong>Advanced</strong> Table</h1>
                    <div className='search'>
                        <input type='text' placeholder='Search...' />
                    </div>
                    <div className='controls'>
                        <a href='#/' className='minimize'><i className='fa fa-chevron-down' /></a>
                        <a href='#/' className='refresh'><i className='fa fa-refresh' /></a>
                        <a href='#/' className='remove'><i className='fa fa-times' /></a>
                    </div>
                </div>

                <div className='tile-widget bg-transparent-black-2'>
                    <div className='row'>
                        <div className='col-sm-4 col-xs-6'>
                            <div className='input-group table-options'>
                                <select className='chosen-select form-control'>
                                    <option>Bulk Action</option>
                                    <option>Delete Selected</option>
                                    <option>Copy Selected</option>
                                    <option>Archive Selected</option>
                                </select>
                                <span className='input-group-btn'>
                                    <button className='btn btn-default' type='button'>Apply</button>
                                </span>
                            </div>
                        </div>
                        <div className='col-sm-8 col-xs-6 text-right'>
                            <div className='btn-group btn-group-xs table-options'>
                                <button type='button' className='btn btn-default'>Day</button>
                                <button type='button' className='btn btn-default'>Week</button>
                                <button type='button' className='btn btn-default'>Month</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='tile-body nopadding'>
                    <table className='table table-bordered table-sortable'>
                        <thead>
                            <tr>
                                <th>
                                    <div className='checkbox check-transparent'>
                                        <input type='checkbox' value='1' id='allchck' />
                                        <label htmlFor='allchck' />
                                    </div>
                                </th>
                                <th className='sortable sort-alpha sort-asc'>First Name</th>
                                <th className='sortable sort-alpha'>Last Name</th>
                                <th className='sortable sort-alpha'>Username</th>
                                <th style={{ width: 30 }} />
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div className='checkbox check-transparent'>
                                        <input type='checkbox' value='1' id='chck01' />
                                        <label htmlFor='chck01' />
                                    </div>
                                </td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                                <td><a href='#/' className='check-toggler checked'> </a></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className='checkbox check-transparent'>
                                        <input type='checkbox' value='1' id='chck02' />
                                        <label htmlFor='chck02' />
                                    </div>
                                </td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                                <td><a href='#/' className='check-toggler'> </a></td>
                            </tr>
                            <tr>
                                <td>
                                    <div className='checkbox check-transparent'>
                                        <input type='checkbox' value='1' id='chck03' />
                                        <label htmlFor='chck03' />
                                    </div>
                                </td>
                                <td>Larry</td>
                                <td>the Bird</td>
                                <td>@twitter</td>
                                <td><a href='#/' className='check-toggler checked'> </a></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='tile-footer bg-transparent-black-2 rounded-bottom-corners'>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <div className='input-group table-options'>
                                <select className='chosen-select form-control'>
                                    <option>Bulk Action</option>
                                    <option>Delete Selected</option>
                                    <option>Copy Selected</option>
                                    <option>Archive Selected</option>
                                </select>
                                <span className='input-group-btn'>
                                    <button className='btn btn-default' type='button'>Apply</button>
                                </span>
                            </div>
                        </div>
                        <div className='col-sm-4 text-center'>
                            <small className='inline table-options paging-info'>showing 1-3 of 24 items</small>
                        </div>
                        <div className='col-sm-4 text-right sm-center'>
                            <ul className='pagination pagination-xs nomargin pagination-custom'>
                                <li className='disabled'><a href='#/'><i className='fa fa-angle-double-left' /></a>
                                </li>
                                <li className='active'><a href='#/'>1</a></li>
                                <li><a href='#/'>2</a></li>
                                <li><a href='#/'>3</a></li>
                                <li><a href='#/'>4</a></li>
                                <li><a href='#/'>5</a></li>
                                <li><a href='#/'><i className='fa fa-angle-double-right' /></a></li>
                            </ul>
                        </div>
                    </div>
                </div>

            </section>
        );
    }
}
export default AdvancedTable;
