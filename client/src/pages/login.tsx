import React, {Component} from "react";
import img_Login from '../assets/images/logo-big.png'
import '../assets/css/bootstrap.min.css';
import '../assets/css/font-awesome.min.css';
import '../assets/css/bootstrap-checkbox.css';
import '../assets/css/bootstrap-dropdown-multilevel.css';
import '../assets/css/minimal.css';

export default class LogIn extends Component {
    public render(): JSX.Element {
        return (
            <div className="bg-1">
                <div id="wrap">
                    <div className="row">
                        <div id="content" className="col-md-12 full-page login">
                            <div className="inside-block">
                                <img src={img_Login} alt={""} className="logo" />
                                <h1><strong>Welcome</strong> Stranger</h1>
                                <h5>Minimal Admin Theme</h5>
                                <form id="form-signin" className="form-signin">
                                    <section>
                                        <div className="input-group">
                                            <input type="text" className="form-control" name="username"
                                                   placeholder="Username" />
                                            <div className="input-group-addon"><i className="fa fa-user" /></div>
                                        </div>
                                        <div className="input-group">
                                            <input type="password" className="form-control" name="password"
                                                   placeholder="Password" />
                                            <div className="input-group-addon"><i className="fa fa-key" /></div>
                                        </div>
                                    </section>
                                    <section className="controls">
                                        <div className="checkbox check-transparent">
                                            <input type="checkbox" value="1" id="remember" checked onChange={() => {
                                            }} />
                                            <label htmlFor="remember">Remember me</label>
                                        </div>
                                        <a href="/#">Forget password?</a>
                                    </section>
                                    <section className="log-in">
                                        <button className="btn btn-greensea">Log In</button>
                                        <span>or</span>
                                        <button className="btn btn-slategray">Create an account</button>
                                    </section>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}