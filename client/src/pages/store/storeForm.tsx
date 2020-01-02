import { Button, Form, Icon, Input, Modal, Select, TimePicker, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Store } from '../../models/store';
import { Repository } from '../../repository';
import { StoreService } from '../../service/store.service';
import { Validator } from '../../utils/validator';

const { Option } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    store?: Store;
    onCancel: any;
    onCreate?: any;
}

const storeForm = Form.create<Props>({ name: 'StoreForm' })(
    (props: Props) => {
        const { visible, onCancel, onCreate, store } = props;
        const { getFieldDecorator } = props.form;

        const [loading, setLoading] = useState(false);
        const [logo, setLogo] = useState<File>();
        const [imagePreview, setImagePreview] = useState<any>('');
        const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
        const { enqueueSnackbar } = useSnackbar();

        const handleSubmit = () => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    setLoading(true);
                    if (!store) {
                        StoreService.create(Repository.token, {
                            name: values.name,
                            hotline: values.prefix + values.hotline,
                            address: values.address,
                            logoFile: logo,
                            openTime: values.openTime ? (values.openTime as Moment).toDate() : undefined,
                            closeTime: values.closeTime ? (values.closeTime as Moment).toDate() : undefined
                        }).then(() => {
                            enqueueSnackbar('Create Store success', { variant: 'success' });
                            setLoading(false);
                            setLogo(undefined);
                            props.form.resetFields();
                            onCancel();
                            if (onCreate) {
                                onCreate();
                            }
                        }).catch((e: any) => {
                            setLoading(false);
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        });
                    } else {
                        StoreService.edit(Repository.token, {
                            id: store.id,
                            name: values.name,
                            hotline: values.prefix + values.hotline,
                            address: values.address,
                            logoFile: logo,
                            logo: store.logo,
                            openTime: values.openTime ? (values.openTime as Moment).toDate() : undefined,
                            closeTime: values.closeTime ? (values.closeTime as Moment).toDate() : undefined
                        }).then(() => {
                            enqueueSnackbar('Edit Store success', { variant: 'success' });
                            setLoading(false);
                            setLogo(undefined);
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
                    {store ? 'Edit' : 'Create'} <strong>Store</strong>
                </h3>}
                okText={store ? 'Save' : 'Create'}
                onCancel={onCancel}
                destroyOnClose
                onOk={() => {
                    handleSubmit();
                }}
            >
                <OverlayIndicator show={loading} />
                <Form>
                    <Form.Item label='Name' hasFeedback>
                        {getFieldDecorator('name', {
                            initialValue: store ? store.name : '',
                            rules: [{ required: true, message: 'Please input name!' }]
                        })(
                            <Input placeholder='Name' />
                        )}
                    </Form.Item>
                    <Form.Item label='Hotline' hasFeedback>
                        {getFieldDecorator('hotline', {
                            initialValue: store && store.hotline
                                ? store.hotline.split('+84')[0] || store.hotline.split('+84')[1] : '',
                            rules: [{
                                required: true,
                                message: 'Please input hotline!'
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
                    <Form.Item label='Address' hasFeedback>
                        {getFieldDecorator('address', {
                            initialValue: store ? store.address : '',
                            rules: [{ required: true, message: 'Please input address!' }]
                        })(
                            <Input placeholder='Address' />
                        )}
                    </Form.Item>
                    <Form.Item label='Open Time' hasFeedback>
                        {getFieldDecorator('openTime', {
                            initialValue: store && store.openTime ? moment(store.openTime) : null,
                        })(<TimePicker style={{ width: '100%' }} hideDisabledOptions />)}
                    </Form.Item>
                    <Form.Item label='Close Time' hasFeedback>
                        {getFieldDecorator('closeTime', {
                            initialValue: store && store.closeTime ? moment(store.closeTime) : null,
                        })(<TimePicker style={{ width: '100%' }} hideDisabledOptions />)}
                    </Form.Item>
                    <Form.Item label='Logo'>
                        {getFieldDecorator('logo', {
                            valuePropName: 'logo'
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
                                    if (store && store.logo) {
                                        store.logo = '';
                                    }
                                    setLogo(undefined);
                                }}
                                beforeUpload={(file) => {
                                    if (store && store.logo) {
                                        store.logo = '';
                                    }
                                    setLogo(file);

                                    return false;
                                }}
                                fileList={logo ? [{
                                    uid: 'image',
                                    name: logo.name,
                                    size: logo.size,
                                    originFileObj: logo,
                                    type: logo.type
                                }] : store && store.logo ? [{
                                    uid: 'image',
                                    name: store.logo,
                                    status: 'done',
                                    size: 1,
                                    type: 'image/jpeg',
                                    url: store.logo
                                }] : []}
                            >
                                <Button>
                                    <Icon type='upload' />{' Select logo'}
                                </Button>
                            </Upload>
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

export { storeForm as StoreForm };
