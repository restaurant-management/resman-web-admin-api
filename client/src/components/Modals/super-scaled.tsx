import React, {Component} from 'react';
export default class SuperScaled extends Component {

    public _renderSuperScaled() {
        return(
            <button className='btn btn-drank bottommargin md-trigger' data-modal='modal-11'>Super Scaled</button>
        );
    }
    public _renderModal14() {
        return(
            <div className='md-modal md-effect-14 md-greensea colorize-overlay' id='modal-14'>
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
    public render() {
        return([this._renderSuperScaled(), this._renderModal14()]);
    }
}
