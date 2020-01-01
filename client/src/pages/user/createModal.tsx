import { Backdrop, Modal, Slide } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { Input } from '../../components/Input';
import OverlayIndicator from '../../components/overlayIndicator';
import { RequiredSelect } from '../../components/requiredSelect';
import { Role } from '../../models/role';
import { Store } from '../../models/store';
import { Repository } from '../../repository';
import { RoleService } from '../../service/role.service';
import { StoreService } from '../../service/store.service';

export function CreateModal(props: {
    showModal?: boolean, onClose: () => void, onSubmit?: () => void, username?: string
}) {
    const { showModal, onClose } = props;

    const { register, handleSubmit, errors: formErrors } = useForm();

    const [saving, setSaving] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [loadingStores, setLoadingStores] = useState(true);
    const { enqueueSnackbar } = useSnackbar();

    const [avatar, setAvatar] = useState<File>();
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [selectStores, setSelectedStores] = useState<Store[]>([]);

    useEffect(() => {
        RoleService.getAll(Repository.token).then(value => {
            setRoles(value);
            setLoadingRoles(false);
        });
        StoreService.getAll().then(value => {
            setStores(value);
            setLoadingStores(false);
        });
    }, []);

    const onSave = async (data: any) => {
        setSaving(true);
        try {
            await Repository.createUser({
                username: data.username,
                email: data.email,
                password: data.password,
                fullName: data.fullName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                birthday: new Date(data.birthday),
                avatarFile: avatar,
                roles: selectedRoles.map(e => e.slug),
                storeIds: selectStores.map(e => e.id)
            });

            enqueueSnackbar('Create user success', { variant: 'success' });
            onClose();
            if (props.onSubmit) {
                props.onSubmit();
            }
        } catch (e) {
            enqueueSnackbar(e.toString(), { variant: 'error' });
        }
        setSaving(false);
    };

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
                    <form onSubmit={handleSubmit(onSave)}>
                        <OverlayIndicator show={saving} />
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
                            <div className='form-group'>
                                <Input
                                    name={'username'} required error={!!formErrors.username}
                                    label={'Username'} errorMessage={' This field is required.'}
                                    register={register}
                                />
                            </div>

                            <div className='form-group'>
                                <Input
                                    name={'email'} required error={!!formErrors.email}
                                    label={'Email'} errorMessage={' This field is required.'}
                                    register={register}
                                />
                            </div>

                            <div className='form-group'>
                                <Input
                                    name={'password'} required error={!!formErrors.password} type={'password'}
                                    label={'Password'} errorMessage={' This field is required.'}
                                    register={register}
                                />
                            </div>

                            <div className='form-group'>
                                <Input type='text' placeholder='Full Name' register={register}
                                       name={'fullName'} label={'Full Name'} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='exampleInput'>Address*</label>
                                <textarea
                                    className={'form-control' +
                                    (formErrors.address ? ' parsley-validated parsley-error' : '')}
                                    placeholder='Address'
                                    name={'address'} ref={register({ required: true })}
                                />
                                {formErrors.address && (
                                    <ul className={'parsley-error-list'}>
                                        <li className='required' style={{ display: 'list-item' }}>
                                            {` This field is required.`}
                                        </li>
                                    </ul>
                                )}
                            </div>

                            <div className='form-group'>
                                <Input
                                    name={'phoneNumber'}
                                    required label={'Phone number'} errorMessage={' This field is required.'}
                                    register={register}
                                />
                            </div>

                            <div className='form-group'>
                                <Input type='date' name={'birthday'} label={'Birthday'} required register={register} />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='placeholderInput'>Avatar</label>
                                <div className='input-group'>
                                    <span className='input-group-btn'>
                                        <span className='btn btn-primary btn-file'>
                                            <i className='fa fa-upload' />
                                            <input type='file' onChange={(event) =>
                                                event.target.files && setAvatar(event.target.files[0])}
                                            />
                                        </span>
                                    </span>
                                    <input type='text' className='form-control' readOnly
                                           value={avatar ? avatar.name : ''} />
                                </div>
                            </div>

                            <div className='form-group'>
                                <label htmlFor='placeholderInput'>Roles</label>
                                <Select<Role>
                                    loading={loadingRoles}
                                    isMulti value={selectedRoles}
                                    options={roles} isSearchable
                                    onChange={(selected: any) => setSelectedRoles(selected)}
                                    getOptionLabel={option => option.name}
                                    getOptionValue={option => option.slug}
                                />
                            </div>

                            <div className='form-group'>
                                <label htmlFor='placeholderInput'>Stores*</label>
                                <RequiredSelect
                                    loading={loadingStores}
                                    isMulti value={selectStores}
                                    options={stores} isSearchable
                                    onChange={(selected: any) => setSelectedStores(selected)}
                                    getOptionLabel={(option: any) => option.name}
                                    getOptionValue={(option: any) => option.id.toString()}
                                />
                            </div>
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
