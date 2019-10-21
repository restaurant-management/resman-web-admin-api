import React, { Component } from 'react';
import DatetimePicker from './datetime-picker';
import ImagePicker from './image-picker';
import Input from './input';
import MulImagePicker from './mul-image-picker';
import MulSelectionBox from './multiple-select-box';
import NumberValidation from './number-validation';
import RowSelect from './row-select';
import NormalSectionBox from './selection-box';
import TextArea from './text-area';
import ToggleSwitchWithLable from './toggle-switches-with-labels';

export default class OpenModalConfirmation extends Component {
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
                                <Input label='Username' />
                                <Input type='password' label='Password' />
                                <TextArea label='Textarea' />
                                <NumberValidation label='Numbervalidation' />
                                <NormalSectionBox
                                    label='Selection box'
                                    Options={['hien', 'nguyen', 'duy', 'trong']}
                                    hint='res man'
                                    onValueChange={(value) => console.log(value)}
                                />
                                <MulSelectionBox
                                    label='Mul select box'
                                    Options={['hien', 'nguyen', 'duy', 'trong']}
                                    hint='res man'
                                    onValueChange={(value) => console.log(value)}
                                />
                                {/* <MulSelectionBox item=[]/> */}
                                <ToggleSwitchWithLable label='Toggle' />
                                <ImagePicker label='Add image' />
                                <MulImagePicker label='Select dish images' onValueChange={this._handle.bind(this)} />
                                {/* <NormalSectionBox label='Selection box' /> */}
                                {/* <MulSelectionBox /> */}
                                {/* <RowSelect /> */}

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

    private _handle(images: string[]) {
        console.log(images);
    }
}
