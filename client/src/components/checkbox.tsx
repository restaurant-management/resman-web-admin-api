import React, { Component } from 'react';

interface CheckboxProps {
    readonly id: string;
    readonly checked?: boolean;
    readonly onChange?: (value: boolean) => void;
    readonly label?: string;
}

export class Checkbox extends Component<CheckboxProps, { checked: boolean }> {
    constructor(props: CheckboxProps) {
        super(props);
        this.state = {
            checked: !!this.props.checked
        };
    }

    public render(): JSX.Element {
        return (
            <div>
                <input
                    type='checkbox'
                    value='1'
                    id={this.props.id}
                    checked={this.state.checked}
                    onChange={this._onChange.bind(this)}
                />
                <label htmlFor={this.props.id}>
                    <span style={{ marginLeft: 5 }}>{this.props.label}</span>
                </label>
            </div>
        );
    }

    private _onChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            checked: event.target.checked
        });

        if (this.props.onChange) {
            this.props.onChange(event.target.checked);
        }
    }
}
