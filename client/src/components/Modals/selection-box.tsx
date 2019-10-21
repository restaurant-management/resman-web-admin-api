import React, { Component } from 'react';

export interface SelectBoxProps {
    readonly label?: string;
    readonly Options?: string[];
    readonly hint?: string;
    readonly onValueChange?: (value: string) => void;
}
export interface SelectBoxState {
    readonly value: any;
}

export default class NormalSectionBox extends Component<SelectBoxProps, SelectBoxState> {
    constructor(props: SelectBoxProps) {
        super(props);
        this.state = { value: null };
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
                <label>{this.props.label}</label>
                <select
                    value={this.state.value}
                    onChange={this._onChange.bind(this)}
                    className='form-control'
                >
                    {optionsView}
                </select>
                <span className='help-block'>{this.props.hint}</span>
            </div>
        );
    }

    private _onChange(e: React.ChangeEvent<HTMLSelectElement>) {
        this.setState({
            value: e.target.value
        });
        if (this.props.onValueChange) {
            this.props.onValueChange(e.target.value);
        }
    }
}
