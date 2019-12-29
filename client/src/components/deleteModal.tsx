import { Backdrop, Modal, Slide } from '@material-ui/core';
import React from 'react';

export function DeleteModal(props: { showModal?: boolean, onClose: () => void, onSubmit?: () => void }) {
    const { onClose, onSubmit, showModal } = props;

    return (
        <Modal
            disableEnforceFocus
            open={!!showModal}
            onBackdropClick={onClose}
            className='modal'
            style={{
                display: 'flex',
                justifyContent: 'center',
                overflowY: 'auto'
            }}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Slide in={showModal} direction={'down'}>
                <div className='modal-content'>
                    <form>
                        <div className='modal-header'>
                            <button type='button' className='close'
                                    onClick={onClose}>
                                Close
                            </button>
                            <h3 className='modal-title'>
                                Create <strong>User</strong>
                            </h3>
                        </div>
                        <div className='modal-body'>
                        </div>
                        <div className='modal-footer'>
                            <button className='btn btn-red' type='button' onClick={onClose}>
                                {`Close`}
                            </button>
                            <button className='btn btn-green' type='submit'>
                                {`Create`}
                            </button>
                        </div>
                    </form>
                </div>
            </Slide>
        </Modal>
    );
}
