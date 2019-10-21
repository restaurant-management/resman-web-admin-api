import React, { Component } from 'react';

export default class RowSelect extends Component {
    public render() {
        return (
                <div>
                    <h5><strong>Row</strong> Select</h5>

                    <ul className='nolisttypes inlineSelect rowSelect green'>
                        <li className='title'>
                            <h5>Options:</h5>
                        </li>
                        <li>
                            <div className='checkbox'>
                                <input type='checkbox' value='1' id='opt01' />
                                <label htmlFor='opt01'>Option 1</label>
                            </div>
                        </li>
                        <li>
                            <div className='checkbox'>
                                <input type='checkbox' checked value='1' id='opt02' />
                                <label htmlFor='opt02'>Option 2</label>
                            </div>
                        </li>
                        <li>
                            <div className='checkbox'>
                                <input type='checkbox' value='1' id='opt03' />
                                <label htmlFor='opt03'>Option 3</label>
                            </div>
                        </li>
                        <li>
                            <div className='checkbox'>
                                <input type='checkbox' value='1' id='opt04' />
                                <label htmlFor='opt04'>Option 4</label>
                            </div>
                        </li>
                    </ul>
                </div>
        );
    }
}
