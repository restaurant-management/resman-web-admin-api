import { Fade } from '@material-ui/core';
import React from 'react';

export default function OverlayIndicator(props: { show?: boolean }) {
    return (
        <Fade in={props.show}>
            <div className={'resman-overlay'}>
                <img className={'resman-reloader'} src={'/assets/images/loader.gif'} alt='' />
            </div>
        </Fade>
    );
}
