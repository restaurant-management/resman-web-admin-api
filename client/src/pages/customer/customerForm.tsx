import { Button, DatePicker, Form, Icon, Input, Modal, Select, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Customer } from '../../models/customer';
import { Repository } from '../../repository';
import { CustomerService } from '../../service/customer.service';
import { Validator } from '../../utils/validator';

const { Option } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    customer?: Customer;
    onCancel: any;
    onCreate?: any;
}

const customerForm = Form.create<Props>({ name: 'CustomerForm' })(
    (props: Props) => {
        const { visible, onCancel, onCreate, customer } = props;
        const { getFieldDecorator, getFieldValue } = props.form;

        const [loading, setLoading] = useState(false);
        const [avatar, setAvatar] = useState<File>();
        const [imagePreview, setImagePreview] = useState<any>('');
        const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
        const { enqueueSnackbar } = useSnackbar();

        const handleSubmit = () => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    setLoading(true);
                    if (!customer) {
                        CustomerService.createCustomer(Repository.token, {
                            username: values.username,
                            email: values.email,
                            password: values.password,
                            fullName: values.fullName,
                            phoneNumber: values.prefix + values.phoneNumber,
                            birthday: (values.birthday as Moment).toDate(),
                            avatarFile: avatar,
                            addresses: values.addresses.map((e: string) => ({ address: e }))
                        }).then(() => {
                            enqueueSnackbar('Create Customer success', { variant: 'success' });
                            setLoading(false);
                            setAvatar(undefined);
                            props.form.resetFields();
                            onCancel();
                            if (onCreate) {
                                onCreate();
                            }
                        }).catch((e: any) => {
                            setLoading(false);
                            console.log(e);
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        });
                    } else {
                        CustomerService.editCustomer(Repository.token, {
                            uuid: customer.uuid,
                            username: values.username,
                            email: values.email,
                            password: values.password,
                            fullName: values.fullName,
                            phoneNumber: values.prefix + values.phoneNumber,
                            birthday: (values.birthday as Moment).toDate(),
                            avatar: customer.avatar,
                            avatarFile: avatar,
                            addresses: values.addresses ? values.addresses.map((e: string, i: number) => ({
                                address: e, id: customer && customer.addresses && customer.addresses[i]
                                    ? customer.addresses[i].id : undefined
                            })) : []
                        }).then(() => {
                            enqueueSnackbar('Edit Customer success', { variant: 'success' });
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
                    {customer ? 'Edit' : 'Create'} <strong>Customer</strong>
                </h3>}
                okText={customer ? 'Save' : 'Create'}
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
                            initialValue: customer ? customer.username : '',
                            rules: [{ required: true, message: 'Please input Username!' }]
                        })(
                            <Input
                                disabled={!!customer}
                                prefix={<Icon type='user' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='Username'
                            />
                        )}
                    </Form.Item>
                    <Form.Item label='E-mail' hasFeedback>
                        {getFieldDecorator('email', {
                            initialValue: customer ? customer.email : '',
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
                                disabled={!!customer}
                                prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder='Email'
                            />
                        )}
                    </Form.Item>
                    <Form.Item label={'Password'} hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [{ required: !customer, message: 'Please input Password!' }]
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
                            initialValue: customer && customer.fullName ? customer.fullName : undefined
                        })(<Input placeholder={'Full name'} />)}
                    </Form.Item>
                    <Form.Item label='Phone Number' hasFeedback>
                        {getFieldDecorator('phoneNumber', {
                            initialValue: customer && customer.phoneNumber
                                ? customer.phoneNumber
                                    .split('+84')[0] || customer.phoneNumber.split('+84')[1] : '',
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
                            initialValue: customer && customer.birthday ? moment(customer.birthday) : null,
                            rules: [{ required: true, message: 'Please select birthday' }]
                        })(<DatePicker style={{ width: '100%' }} format={'DD/MM/YYYY'} />)}
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
                                    if (customer && customer.avatar) {
                                        customer.avatar = '';
                                    }
                                    setAvatar(undefined);
                                }}
                                beforeUpload={(file) => {
                                    if (customer && customer.avatar) {
                                        customer.avatar = '';
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
                                }] : customer && customer.avatar ? [{
                                    uid: 'avatar',
                                    name: customer.avatar,
                                    status: 'done',
                                    size: 1,
                                    type: 'image/jpeg',
                                    url: customer.avatar
                                }] : []}
                            >
                                <Button>
                                    <Icon type='upload' /> Select avatar
                                </Button>
                            </Upload>
                        )}
                    </Form.Item>
                    {getFieldDecorator('addressKeys', {
                        initialValue: customer && customer.addresses ? customer.addresses.map((it, i) => i) : []
                    })}
                    {
                        getFieldValue('addressKeys').map((item: number, index: number) => (
                            <Form.Item
                                label={index === 0 ? 'Addresses' : ''}
                                required={false} hasFeedback
                                key={index}
                            >
                                {getFieldDecorator(`addresses[${item}]`, {
                                    validateTrigger: ['onChange', 'onBlur'],
                                    initialValue: customer && customer.addresses && customer.addresses[index]
                                        ? customer.addresses[index].address : undefined,
                                    rules: [
                                        {
                                            required: true,
                                            whitespace: true,
                                            message: 'Please input address or delete this field.',
                                        },
                                    ],
                                })(<Input
                                    placeholder='Address' style={{ width: '100%' }}
                                    suffix={
                                        <Icon
                                            className='dynamic-delete-button'
                                            type='minus-circle-o'
                                            onClick={() => {
                                                const addressKeys: number[] = getFieldValue('addressKeys') || [];
                                                props.form.setFieldsValue({
                                                    addressKeys: addressKeys.filter(key => key !== item),
                                                });
                                            }}
                                        />
                                    }
                                />)}
                            </Form.Item>
                        ))
                    }
                    <Form.Item>
                        <Button type='dashed' style={{ width: '100%' }}
                            onClick={() => {
                                const addressKeys: number[] = getFieldValue('addressKeys') || [];
                                props.form.setFieldsValue({
                                    addressKeys: [...addressKeys, addressKeys.length]
                                });
                            }}
                        >
                            <Icon type='plus' />{` Add address`}
                        </Button>
                    </Form.Item>
                </Form>
                <Modal visible={showImagePreview} footer={null} onCancel={() => setShowImagePreview(false)}>
                    <img alt='avatar' style={{ width: '100%' }} src={imagePreview} />
                </Modal>
            </Modal>
        );
    }
);

export { customerForm as CustomerForm };
