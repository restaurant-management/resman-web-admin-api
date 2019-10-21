import React, { Component } from 'react';

export default class ChosenMulSelect extends Component {
    public render() {
        return (
            <form role='form'>

                <div className='form-group'>
                    <label htmlFor='chosen'>Chosen Multiple-Select</label>
                    <select data-placeholder='Select recipients...' multiple
                    className='chosen-select form-control' id='chosen'>
                        <option value='ici@gmail.com'>ici@gmail.com</option>
                        <option value='johny@gmail.com'>johny@gmail.com</option>
                        <option value='arnie@gmail.com'>arnie@gmail.com</option>
                        <option value='pete@gmail.com'>pete@gmail.com</option>
                        <option value='gorge@gmail.com'>gorge@gmail.com</option>
                    </select>
                </div>

            </form>
        );
    }
}
