import React from 'react';

export function Input(props: {
    errorMessage?: string, error?: boolean, label?: string, required?: boolean,
    register?: any, placeholder?: string, name: string, type?: string, style?: any
}) {
    const { error, register, placeholder, name, type, label, required, errorMessage } = props;

    return (
        <>
            {label && <label>{label}{required && '*'}</label>}
            <input
                type={type} style={props.style}
                className={'form-control' + (error ? ' parsley-validated parsley-error' : '')}
                placeholder={placeholder || label}
                name={name} ref={register({ required })}
            />
            {error && (
                <ul className={'parsley-error-list'}>
                    <li className='required' style={{ display: 'list-item' }} >
                        {errorMessage}
                    </li>
                </ul>
            )}
        </>
    );
}
