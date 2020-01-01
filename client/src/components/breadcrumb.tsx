import { Component } from 'react';
import React from 'react';

export class Breadcrumb extends Component {
    public render() {
        return (
            <div className='breadcrumbs'>
                <ol className='breadcrumb'>
                    <li>You are here</li>
                    <li><a href='/#'>Minimal</a></li>
                    <li><a href='/#'>Example Pages</a></li>
                    <li className='active'>Blank Page</li>
                </ol>
            </div>
        );
    }
}
