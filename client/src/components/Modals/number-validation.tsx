import React, { Component } from 'react';

export interface NumberValidationProps {
    readonly label?: string;
}

export default class NumberValidation extends Component<NumberValidationProps> {
    constructor(props: NumberValidationProps) {
        super(props);
    }
    public render() {
        return (
                <div className='form-group'>
                    <label htmlFor='numval' >{this.props.label} *</label>
                        <input type='text' className='form-control' id='numval' parsley-trigger='change'
                            parsley-required='true' parsley-type='number' parsley-validation-minlength='0'
                            placeholder='must be a number...' />
                </div>
        );
    }
}
