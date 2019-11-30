import { Component } from 'react';
import React from 'react';

interface AgActionsProp {
    node: any;
}

export class AgActions extends Component<AgActionsProp, any> {
    public render() {
        const style = { paddingLeft: 15, paddingRight: 15, paddingTop: 2, paddingBottom: 2 };

        return (
            <span>
                <button
                    className='resman-btn resman-cyan resman-left-border-radius'
                    style={style}
                >
                    <i className='fa fa-eye'></i>
                </button>
                <button
                    className='resman-btn resman-warning resman-no-border-radius'
                    style={style}
                >
                    <i className='fa fa-pencil'></i>
                </button>
                <button
                    className='resman-btn resman-danger resman-right-border-radius'
                    style={style}
                >
                    <i className='fa fa-trash-o'></i>
                </button>
            </span>
        );
    }
}
