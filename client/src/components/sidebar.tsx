import { Icon } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';
import { Li } from './li';

export default function SideBar() {
    return (
        <ul className='nav navbar-nav side-nav' id='sidebar'>

            <li className='collapsed-content'>
                <ul>
                    <Li key='search' className='search' />
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
                        <Link to='/daily-dishes'>
                            <Icon type='profile' />
                            {` Daily Dish`}
                        </Link>
                    </Li>
                    <Li>
                        <Link to='/dishes'>
                            <Icon type='gold' />
                            {` Dish`}
                        </Link>
                    </Li>
                    <Li>
                        <Link to='/bills'>
                            <Icon type='file-done' />
                            {` Bill`}
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

        </ul>
    );
}
