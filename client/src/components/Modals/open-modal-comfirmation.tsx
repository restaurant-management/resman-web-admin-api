import React, { Component } from 'react';

export default class OpenModalDialog extends Component {
    public render() {
        return ([this._renderOpenModalConfirmation(), this._renderModalTitle1()]);
    }

    private _renderOpenModalConfirmation() {
        return (
            <a href={'#modalConfirm'} role='button' className='btn btn-red' data-toggle='modal'>Open Modal
                Confirmation</a>
        );
    }
    private _renderModalTitle1() {
        return (
            <div className='modal fade' id='modalConfirm' tabIndex={-1} role='dialog'
                aria-labelledby='modalConfirmLabel' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>Close
                            </button>
                            <h3 className='modal-title' id='modalConfirmLabel'><strong>Modal</strong> title</h3>
                        </div>
                        <div className='modal-body'>
                            <form>

                                <div className='form-group'>
                                    <label htmlFor='exampleInput'>Normal input field</label>
                                    <input type='text' className='form-control' id='exampleInput' />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='passwordInput'>Password input field</label>
                                    <input type='password' className='form-control' id='passwordInput' />
                                </div>

                                <div className='form-group'>
                                    <label htmlFor='placeholderInput'>Input with placeholder</label>
                                    <input type='text' className='form-control' id='placeholderInput'
                                        placeholder='This is a placeholder...' />
                                </div>

                                <div className='form-group'>
                                    <label>Normal textarea</label>
                                    <textarea className='form-control' rows={3} />
                                </div>

                            </form>
                        </div>
                        <div className='modal-footer'>
                            <button className='btn btn-red' data-dismiss='modal' aria-hidden='true'>Close</button>
                            <button className='btn btn-green'>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
