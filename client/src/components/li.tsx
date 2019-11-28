import React, { Component } from 'react';

export class Li extends Component<any, any> {
    public render() {
        const { id, className, children } = this.props;
        return (<li id={id} className={className}>{children}</li>);
    }
}
