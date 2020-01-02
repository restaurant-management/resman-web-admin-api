import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import img_Login from '../assets/images/logo-big.png';
import { Checkbox } from '../components/checkbox';
import LoadingIndicator from '../components/loadingIndicator';
import { useKey } from '../lib/useKey';
import { Repository } from '../repository';

export default function LogIn(props: any) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(true);
    const [loading, setLoading] = useState(false);
    const [redirectToReferrer, setRedirectToReferrer] = useState(Repository.isAuth);

    const { enqueueSnackbar } = useSnackbar();

    const login = async () => {
        setLoading(true);
        try {
            await Repository.login(username, password, remember);
            setRedirectToReferrer(true);
            setLoading(false);
        } catch (e) {
            setLoading(false);
            enqueueSnackbar(e.message, { variant: 'error' });
        }
    };

    if (useKey('enter') && !loading) {
        login();
    }

    const from = props.location && props.location.state
        ? props.location.state.from : Repository.isAuth ? { pathname: '/dashboard' } : { pathname: '/' };

    if (redirectToReferrer) {
        return <Redirect to={from} push />;
    }

    return (
        <div id='wrap'>
            <LoadingIndicator show={loading} />
            <div className='row'>
                <div id='content' className='col-md-12 full-page login' style={{ overflow: 'hidden' }}>
                    <div className='inside-block'>
                        <img src={img_Login} alt={''} className='logo' />
                        <h1><strong>Welcome</strong> Stranger</h1>
                        <h5>Resman</h5>
                        <div className='form'>
                            <section>
                                <div className='input-group'>
                                    <input
                                        type='text'
                                        className='form-control'
                                        value={username}
                                        placeholder='Username'
                                        onChange={(event) => {
                                            setUsername(event.target.value);
                                        }}
                                    />
                                    <div className='input-group-addon'><i className='fa fa-user' /></div>
                                </div>
                                <div className='input-group'>
                                    <input type='password' className='form-control'
                                        placeholder='Password'
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                        }} />
                                    <div className='input-group-addon'><i className='fa fa-key' /></div>
                                </div>
                            </section>
                            <section className='controls'>
                                <div className='checkbox check-transparent'>
                                    <Checkbox label={'Remember'} id={'remember'} checked={remember}
                                        onChange={(value) => {
                                            setRemember(value);
                                        }}
                                    />
                                </div>
                                <a href='#/'>{`Forget password?`}</a>
                            </section>
                            <section className='log-in'>
                                <button
                                    disabled={loading}
                                    className='btn btn-greensea'
                                    onClick={login}
                                >
                                    {`Log In`}
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
