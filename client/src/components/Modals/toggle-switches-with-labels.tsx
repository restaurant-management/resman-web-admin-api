import React, { Component } from 'react';

export interface ToggleProps {
    readonly label?: string;
}

export default class ToggleSwitchWithLable extends Component<ToggleProps> {
    constructor(props: ToggleProps) {
        super(props);
    }
    public render() {
        return (
            <div className='from-group'>
                <label htmlFor='input05'>{this.props.label}</label>
                <div className='onoffswitch labeled drank'>
                    <input type='checkbox' name='onoffswitch' className='onoffswitch-checkbox'
                        id='myonoffswitch20' />
                    <label className='onoffswitch-label' htmlFor='myonoffswitch20'>
                        <span className='onoffswitch-inner'></span>
                        <span className='onoffswitch-switch'></span>
                    </label>
                </div>
            </div>
        );
    }
}