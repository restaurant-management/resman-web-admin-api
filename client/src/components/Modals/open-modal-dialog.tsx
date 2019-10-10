import React, {Component} from 'react';

export default class OpenModalDialog extends Component{
    _renderOpenModalDialog(){
        return(
        <a href={"#modalDialog"} role="button" className="btn btn-cyan" data-toggle="modal">Open Modal Dialog</a>
        );
    }
    _renderModalTitle(){
        return(
        <div className="modal fade" id="modalDialog" tabIndex={-1} role="dialog" aria-labelledby="modalDialogLabel"
             aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">Close</button>
                        <h3 className="modal-title" id="modalDialogLabel"><strong>Modal</strong> title</h3>
                    </div>
                    <div className="modal-body">
                        <p>One fine body&hellip;</p>
                    </div>
                </div>
            </div>
        </div>
        );
    }

    render(){
        return([this._renderModalTitle(),this._renderOpenModalDialog()]);
    }
}