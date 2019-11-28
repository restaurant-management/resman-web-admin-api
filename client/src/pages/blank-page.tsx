import React, { Component } from 'react';
import '../assets/css/animate.css';
import '../assets/css/bootstrap-checkbox.css';
import '../assets/css/bootstrap-dropdown-multilevel.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/jquery.mmenu.all.css';
import '../assets/css/jquery.videoBackground.css';
import '../assets/css/minimal.css';
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
