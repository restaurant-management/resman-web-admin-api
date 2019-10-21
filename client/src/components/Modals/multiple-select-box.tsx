import React, { Component } from 'react';

export interface MulSelectionBoxProps {
    readonly label?: string;
    readonly Options: string[];
    readonly hint?: string;
    readonly onValueChange?: (value: string[]) => void;
}
export interface MulSelectionBoxState {
    readonly value: string[];
}

export default class MulSelectionBox extends Component<MulSelectionBoxProps, MulSelectionBoxState> {
    constructor(props: MulSelectionBoxProps) {
        super(props);
        this.state = { value: ['Select some option'] };
    }
    public render() {
        let optionsView: JSX.Element[] = [];
        if (this.props.Options) {
            optionsView = this.props.Options.map(option => {
                return <option value={option} key={option} >{option}</option>;
            });
        }

        return (
            <div className='form-group'>
                <label htmlFor='input08' >{this.props.label}</label>
                <select
                    value={this.state.value}
                    onChange={this._onChange.bind(this)}
                    multiple
                    className='chosen-select form-control'
                    id='input08'>
                    {optionsView}
                </select>
                <span className='help-block'>{this.props.hint}</span>
            </div>
        );
    }

    private _onChange(e: any) {
        this.setState({
            value: e.target.value
        });
        if (this.props.onValueChange) {
            this.props.onValueChange(e.target.value);
        }
    }
}
