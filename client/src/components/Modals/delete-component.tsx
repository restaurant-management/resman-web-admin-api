import React, { Component } from 'react';

export default class DeleteComponent extends Component {
    public render() {
        return ([this._renderDeleteModalTitle(), this._renderOpenDeleteModalDialog()]);
    }

    private _renderOpenDeleteModalDialog() {
        return (
            <a href={'#modalDialog'} role='button' className='btn btn-cyan' data-toggle='modal'>Open Modal Dialog</a>
        );
    }

    private _renderDeleteModalTitle() {
        return (
            <div className='modal fade' id='modalDialog' tabIndex={-1} role='dialog' aria-labelledby='modalDialogLabel'
                aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-hidden='true'>
                                Close
                            </button>
                            <h3 className='modal-title' id='modalDialogLabel'><strong>Modal</strong> title</h3>
                        </div>
                        <div className='modal-body'>
                            <p>Are you sure delete this&hellip;</p>
                            <button className='btn btn-red' data-dismiss='modal' aria-hidden='true'>Close</button>
                            <button className='btn btn-green'>Save changes</button>
                        </div>
                        {/* <div className='modal-footer'>
                            <button className='btn btn-red' data-dismiss='modal' aria-hidden='true'>Close</button>
                            <button className='btn btn-green'>Save changes</button>
                        </div> */}
                    </div>
                </div>
            </div>
        );
    }
}
