import React, { Component } from 'react';
export default class RotateInLeft3D extends Component {
    public render() {
        return ([this._renderRotateInLeft3D(), this._renderModal8()]);
    }

    private _renderRotateInLeft3D() {
        return (
            <button className='btn btn-greensea bottommargin md-trigger' data-modal='modal-15'>3D Rotate In
                Left</button>
        );
    }

    private _renderModal8() {
        return (
            <div className='md-modal md-effect-8 md-hotpink colorize-overlay' id='modal-8'>
                <div className='md-content'>
                    <h3>Modal Dialog</h3>
                    <div>
                        <p>This is a modal window. You can do the following things with it:</p>
                        <ul>
                            <li><strong>Read:</strong> modal windows will probably tell you something important so don't
                                forget to read what they say.
                            </li>
                            <li><strong>Look:</strong> a modal window enjoys a certain kind of attention; just look at
                                it and appreciate its presence.
                            </li>
                            <li><strong>Close:</strong> click on the button below to close the modal.</li>
                        </ul>
                        <button className='md-close btn btn-default'>Close me!</button>
                    </div>
                </div>
            </div>
        );
    }
}
