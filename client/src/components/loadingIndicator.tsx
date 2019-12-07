import { Fade } from '@material-ui/core';
import React from 'react';

// const loadingIndicator = document.createElement('div');
// loadingIndicator.className = 'mask';

// const loader = document.createElement('div');
// loader.id = 'loader';

// loadingIndicator.appendChild(loader);

// export { loadingIndicator as LoadingIndicator };

// Auto hide by 
export default function LoadingIndicator() {
    return (
        <div className={'mask'}>
            <div id={'loader'} />
        </div>
    );
}
