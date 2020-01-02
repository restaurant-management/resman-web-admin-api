import { Button, DatePicker, Form, Icon, Input, Modal, Select, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Role } from '../../models/role';
import { Store } from '../../models/store';
import { User } from '../../models/user';
import { Repository } from '../../repository';
import { UserService } from '../../service';
import { RoleService } from '../../service/role.service';
import { StoreService } from '../../service/store.service';
import { Validator } from '../../utils/validator';

const { Option } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    user?: User;
    onCancel: any;
    onCreate?: any;
}

const userForm = Form.create<Props>({ name: 'UserForm' })(
    function (props: Props) {
        const { visible, onCancel, onCreate, user } = props;
        const { getFieldDecorator } = props.form;

        const [loading, setLoading] = useState(false);
        const [roles, setRoles] = useState<Role[]>([]);
        const [stores, setStores] = useState<Store[]>([]);
        const [avatar, setAvatar] = useState<File>();
        const [imagePreview, setImagePreview] = useState<any>('');
        const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
        const { enqueueSnackbar } = useSnackbar();

        useEffect(() => {
            RoleService.getAll(Repository.token).then(value => {
                setRoles(value);
            });
            StoreService.getAll().then(value => {
                setStores(value);
            });
        }, []);

        const handleSubmit = () => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    setLoading(true);
                    if (!user) {
                        Repository.createUser({
                            username: values.username,
                            email: values.email,
                            password: values.password,
                            fullName: values.fullName,
                            address: values.address,
                            phoneNumber: values.prefix + values.phoneNumber,
                            birthday: (values.birthday as Moment).toDate(),
                            avatarFile: avatar,
                            roles: values.roles,
                            storeIds: values.stores
                        }).then(() => {
                            enqueueSnackbar('Create user success', { variant: 'success' });
                            setLoading(false);
                            setAvatar(undefined);
                            props.form.resetFields();
                            onCancel();
                            if (onCreate) {
                                onCreate();
                            }
                        }).catch(e => {
                            setLoading(false);
                            console.log(e);
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        });
                    } else {
                        UserService.editUser(Repository.token, {
                            uuid: user.uuid,
                            username: values.username,
                            email: values.email,
                            password: values.password,
                            fullName: values.fullName,
                            address: values.address,
                            phoneNumber: values.prefix + values.phoneNumber,
                            birthday: (values.birthday as Moment).toDate(),
                            avatar: user.avatar,
                            avatarFile: avatar,
                            roles: values.roles,
                            storeIds: values.stores
                        }).then(() => {
                            enqueueSnackbar('Edit user success', { variant: 'success' });
                            setLoading(false);
                            setAvatar(undefined);
                            props.form.resetFields();
                            if (onCancel) {
                                onCancel();
                            }
                            if (onCreate) {
                                onCreate();
                            }
                        }).catch(e => {
                            setLoading(false);
                            console.log(e);
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        });
                    }
                }
            });
        };

        return (
            <Modal
                visible={visible}
                title={<h3 className='modal-title'>
                    {user ? 'Edit' : 'Create'} <strong>User</strong>
                </h3>}
                okText={user ? 'Save' : 'Create'}
                onCancel={onCancel}
                destroyOnClose
                onOk={() => {
                    handleSubmit();
                }}
            >
                <OverlayIndicator show={loading} />
                <Form>
                    <Form.Item label='Username' hasFeedback>
                        {getFieldDecorator('username', {
                            initialValue: user ? user.username : '',
                            rules: [{ required: true, message: 'Please input Username!' }]
                        })(
                            <Input
                                disabled={!!user}
                                prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='Username'
                            />
                        )}
                    </Form.Item>
                    <Form.Item label='E-mail' hasFeedback>
                        {getFieldDecorator('email', {
                            initialValue: user ? user.email : '',
                            rules: [
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!'
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!'
                                }
                            ]
                        })(
                            <Input
                                disabled={!!user}
                                prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='Email'
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'Password'} hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [{ required: !user, message: 'Please input Password!' }]
                        })(
                            <Input.Password
                                prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type='password'
                                placeholder='Password'
                            />
                        )}
                    </Form.Item>
                    <Form.Item label='Full name' hasFeedback>
                        {getFieldDecorator('fullName', {
                            initialValue: user && user.fullName ? user.fullName : undefined
                        })(<Input placeholder={'Full name'} />)}
                    </Form.Item>
                    <Form.Item label='Address' hasFeedback>
                        {getFieldDecorator('address', {
                            initialValue: user ? user.address : '',
                            rules: [{ required: true, message: 'Please input Address' }]
                        })(<Input type='textarea' />)}
                    </Form.Item>
                    <Form.Item label='Phone Number' hasFeedback>
                        {getFieldDecorator('phoneNumber', {
                            initialValue: user && user.phoneNumber
                                ? user.phoneNumber
                                    .split('+84')[0] || user.phoneNumber.split('+84')[1] : '',
                            rules: [{
                                required: true,
                                message: 'Please input phone number!'
                            }, {
                                pattern: Validator.phonePattern,
                                message: 'Please input correct phone number!'
                            }]
                        })(<Input addonBefore={getFieldDecorator('prefix', {
                            initialValue: '+84'
                        })(
                            <Select style={{ width: 70 }}>
                                <Option value='+84'>+84</Option>
                            </Select>
                        )} style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item label='Birthday' hasFeedback>
                        {getFieldDecorator('birthday', {
                            initialValue: user && user.birthday ? moment(user.birthday) : null,
                            rules: [{ required: true, message: 'Please select birthday' }]
                        })(<DatePicker style={{ width: '100%' }} />)}
                    </Form.Item>
                    <Form.Item label='Avatar'>
                        {getFieldDecorator('avatar', {
                            valuePropName: 'avatar'
                        })(
                            <Upload
                                name='logo' listType='picture' multiple={false} type='drag'
                                onPreview={async file => {
                                    const getBase64 = (f: File | Blob) => {
                                        return new Promise<any>((resolve, reject) => {
                                            const reader = new FileReader();
                                            reader.readAsDataURL(f);
                                            reader.onload = () => resolve(reader.result);
                                            reader.onerror = error => reject(error);
                                        });
                                    };

                                    if (!file.url && !file.preview) {
                                        if (!file.originFileObj) { return; }
                                        file.preview = await getBase64(file.originFileObj);
                                    }

                                    setImagePreview(file.url || file.preview);
                                    setShowImagePreview(true);
                                }}
                                onRemove={() => {
                                    if (user && user.avatar) {
                                        user.avatar = '';
                                    }
                                    setAvatar(undefined);
                                }}
                                beforeUpload={(file) => {
                                    if (user && user.avatar) {
                                        user.avatar = '';
                                    }
                                    setAvatar(file);

                                    return false;
                                }}
                                fileList={avatar ? [{
                                    uid: 'avatar',
                                    name: avatar.name,
                                    size: avatar.size,
                                    originFileObj: avatar,
                                    type: avatar.type
                                }] : user && user.avatar ? [{
                                    uid: 'avatar',
                                    name: user.avatar,
                                    status: 'done',
                                    size: 1,
                                    type: 'image/jpeg',
                                    url: user.avatar
                                }] : []}
                            >
                                <Button>
                                    <Icon type='upload' /> Select avatar
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    <Form.Item label='Roles' hasFeedback>
                        {getFieldDecorator('roles', {
                            initialValue: user ? user.roles : undefined
                        })(
                            <Select mode='multiple' placeholder='Roles'>
                                {roles.map(e => <Option key={e.slug} value={e.slug}>{e.name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label='Stores' hasFeedback>
                        {getFieldDecorator('stores', {
                            initialValue: user && user.storeIds ? user.storeIds : undefined,
                            rules: [{ required: true, message: 'Please select store' }]
                        })(
                            <Select mode='multiple' placeholder='Stores'>
                                {stores.map(e => <Option key={e.id.toString()} value={e.id}>{e.name}</Option>)}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
                <Modal visible={showImagePreview} footer={null} onCancel={() => setShowImagePreview(false)}>
                    <img alt='avatar' style={{ width: '100%' }} src={imagePreview} />
                </Modal>
            </Modal>
        );
    }
);

export { userForm as UserForm };
