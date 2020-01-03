import { Icon } from 'antd';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Li } from './li';

export default class SideBar extends Component {
    public render() {
        return (
            <ul className='nav navbar-nav side-nav' id='sidebar'>

                <li className='collapsed-content'>
                    <ul>
                        <Li key='search' className='search'></Li>
                    </ul>
                </li>

                <li className='navigation' id='navigation'>
                    <Link to='#/' className='sidebar-toggle' data-toggle='#navigation'>Navigation <i
                        className='fa fa-angle-up' /></Link>

                    <ul className='menu'>
                        <Li>
                            <Link to='/dashboard'>
                                <i className='fa fa-tachometer' />
                                {` Dashboard`}
                            </Link>
                        </Li>
                        <Li>
                            <Link to='/stores'>
                                <Icon type='shop' />
                                {` Store`}
                            </Link>
                        </Li>
                        <Li>
                            <Link to='/warehouses'>
                                <Icon type='database' />
                                {` Warehouse`}
                            </Link>
                        </Li>
                        <Li>
                            <Link to='/dishes'>
                                <Icon type='gold' />
                                {` Dish`}
                            </Link>
                        </Li>
                        <Li>
                            <Link to='/users'>
                                <i className='fa fa-user' />
                                {` User`}
                            </Link>
                        </Li>
                        <Li>
                            <Link to='/customers'>
                                <Icon type='crown' />
                                {` Customer`}
                            </Link>
                        </Li>
                        <Li>
                            <Link to='/roles'>
                                <Icon type='safety' />
                                {` Role`}
                            </Link>
                        </Li>
                    </ul>

                </li>

                <li className='summary' id='order-summary'>
                    <Link to='/#' className='sidebar-toggle underline' data-toggle='#order-summary'>
                        {`Orders Summary `}<i className='fa fa-angle-up' />
                    </Link>

                    <div className='media'>
                        <Link className='pull-right' to='/#'>
                            <span id='sales-chart' />
                        </Link>
                        <div className='media-body'>
                            This week sales
                            <h3 className='media-heading'>26, 149</h3>
                        </div>
                    </div>

                    <div className='media'>
                        <Link className='pull-right' to='/#'>
                            <span id='balance-chart' />
                        </Link>
                        <div className='media-body'>
                            This week balance
                            <h3 className='media-heading'>318, 651</h3>
                        </div>
                    </div>

                </li>

            </ul>
        );
    }
}
