import React, { Component } from 'react';

interface FormModalProp {
    actions?: JSX.Element[];
    title?: string | JSX.Element;
    id: string;
    isShowing?: boolean;
}

export class FormModal extends Component<FormModalProp, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            showModal: this.props.isShowing || false
        };
    }

    public render() {
        return (
            <div className={`modal fade ${this.state.showModal ? 'in' : ''}`}
                tabIndex={this.state.showModal ? 1999 : -1} role='dialog'
                aria-labelledby='modalConfirmLabel' aria-hidden={!this.state.showModal}
                style={{ display: !this.state.showModal ? 'none' : 'block' }}>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal'
                                onClick={() => this.setState({ showModal: false })}
                                aria-hidden={!this.state.showModal}>
                                Close
                            </button>
                            <h3 className='modal-title' id='modalConfirmLabel'>{this.props.title}</h3>
                        </div>
                        <div className='modal-body'>
                            {this.props.children}
                        </div>
                        {this.props.actions && (
                            <div className='modal-footer'>
                                {this.props.actions}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
