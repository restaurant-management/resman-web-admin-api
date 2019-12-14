import { Fade } from '@material-ui/core';
import React from 'react';

export default function LoadingIndicator(props: { show?: boolean }) {
    return (
        <Fade in={props.show}>
            <div className={'mask'}>
                <div id={'loader'} />
            </div>
        </Fade>
    );
}
