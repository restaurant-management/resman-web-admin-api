import React, { Component } from 'react';

interface Props {
    title?: string | JSX.Element;
    message?: string | JSX.Element;
    onClose?: () => void;
}

export class SnackBarContentWrapper extends Component<Props> {
    public render() {
        return (
            <div className='alert alert-red alert-dismissable'>
                <strong>{this.props.title}</strong> {this.props.message}
            </div>
        );
    }
}
