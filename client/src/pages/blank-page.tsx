import React, { Component } from 'react';
import Scaffold from '../components/scaffold';

export default class BlankPage extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            text: ''
        };
    }

    public componentDidMount() {
        fetch('/api/test').then((res: Response) => {
            return res.json();
        }).then((json) => {
            this.setState({
                text: json.message
            });
        });
    }

    public render() {
        return (<Scaffold title='Blank Page' subTitle={this.state.text} />);
    }
}
