import React from 'react';
import Select from 'react-select';

export class RequiredSelect extends React.Component<any, any> {
    public state = {
        value: this.props.value || []
    };

    public selectRef = null;
    public setSelectRef = (ref: any) => {
        this.selectRef = ref;
    }

    public onChange = (value: any, actionMeta: any) => {
        this.props.onChange(value, actionMeta);
        this.setState({ value });
    }

    public getValue = () => {
        if (this.props.value !== undefined) { return this.props.value; }

        return this.state.value || '';
    }

    public render() {
        return (
            <>
                <Select
                    {...this.props}
                    onChange={this.onChange}
                    ref={this.setSelectRef}
                />
                <input
                    tabIndex={-1}
                    autoComplete='off'
                    style={{
                        opacity: 0,
                        width: '100%',
                        height: 0,
                        position: 'absolute'
                    }}
                    onChange={() => {
                        // noop
                    }}
                    value={this.getValue()}
                    required
                />
            </>
        );
    }
}
