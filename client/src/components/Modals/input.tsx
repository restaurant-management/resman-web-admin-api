import React, { Component } from 'react';

export interface InputPropsType {
    readonly type?: string;
    readonly label?: string;
}

export default class Input extends Component<InputPropsType> {
    constructor(props: InputPropsType) {
        super(props);
    }
    public render() {
        return (
            <div className='form-group'>
                <label htmlFor='input01'>{this.props.label}</label>
                <input type={this.props.type || 'text'} className='form-control' id='input01' />
            </div>
        );
    }
}
