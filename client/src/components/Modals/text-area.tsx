import React, { Component } from 'react';

export interface TextAreaProps {
    readonly label?: string;
}

export default class TextArea extends Component<TextAreaProps> {
    constructor(props: TextAreaProps) {
        super(props);
    }
    public render() {
        return (
            <div className='form-group'>
                <label htmlFor='input05' >{this.props.label}</label>
                <textarea className='form-control' id='input05' rows={6} />
            </div>
        );
    }
}
