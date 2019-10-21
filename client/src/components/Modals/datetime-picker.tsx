import React, { Component } from 'react';

export default class DatetimePicker extends Component {
    public render() {
        return (
            <div className='form-group'>
                <label htmlFor='datepicker' className='col-sm-4 control-label'>Datetimepicker field</label>
                <div className='col-sm-8'>
                    <input type='text' className='form-control' id='datepicker' />
                </div>
            </div>
        );
    }
}
