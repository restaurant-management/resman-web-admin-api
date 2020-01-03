import { Form, Icon, Input, InputNumber, Modal, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { UploadFile } from 'antd/lib/upload/interface';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Dish } from '../../models/dish';
import { Repository } from '../../repository';
import { DishService } from '../../service/dish.service';

interface Props extends FormComponentProps {
    visible: boolean;
    dish?: Dish;
    onCancel: any;
    onCreate?: any;
}

const dishForm = Form.create<Props>({ name: 'DishForm' })(
    (props: Props) => {
        const { visible, onCancel, onCreate, dish } = props;
        const { getFieldDecorator } = props.form;

        const [loading, setLoading] = useState(false);
        const [images, setImages] = useState<UploadFile[]>(dish && dish.images
            ? dish.images.map((image, index) => ({
                uid: 'image' + index,
                name: image,
                status: 'done',
                size: 1,
                type: 'image/jpeg',
                url: image
            })) : []);
        const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
        const [imagePreview, setImagePreview] = useState<any>('');
        const { enqueueSnackbar } = useSnackbar();

        useEffect(() => {
            setImages(dish && dish.images
                ? dish.images.map((image, index) => ({
                    uid: 'image' + index,
                    name: image,
                    status: 'done',
                    size: 1,
                    type: 'image/jpeg',
                    url: image
                })) : []);
        }, [dish]);

        const handleSubmit = () => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    setLoading(true);
                    if (!dish) {
                        DishService.create(Repository.token, {
                            name: values.name,
                            description: values.description,
                            defaultPrice: values.defaultPrice,
                            uploadImages: images
                        }).then(() => {
                            enqueueSnackbar('Create Dish success', { variant: 'success' });
                            setLoading(false);
                            setImages([]);
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
                        DishService.edit(Repository.token, {
                            id: dish.id,
                            name: values.name,
                            description: values.description,
                            defaultPrice: values.defaultPrice,
                            uploadImages: images
                        }).then(() => {
                            enqueueSnackbar('Edit Dish success', { variant: 'success' });
                            setLoading(false);
                            setImages([]);
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
                    {dish ? 'Edit' : 'Create'} <strong>Dish</strong>
                </h3>}
                okText={dish ? 'Save' : 'Create'}
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
                            initialValue: dish ? dish.name : '',
                            rules: [{ required: true, message: 'Please input name!' }]
                        })(
                            <Input placeholder='Name' />
                        )}
                    </Form.Item>
                    <Form.Item label='Description' hasFeedback>
                        {getFieldDecorator('description', {
                            initialValue: dish ? dish.description : ''
                        })(<Input type='textarea' />)}
                    </Form.Item>
                    <Form.Item label='Default Price' hasFeedback>
                        {getFieldDecorator('defaultPrice', {
                            initialValue: dish ? dish.defaultPrice : 0
                        })(
                            <InputNumber
                                min={0} style={{ width: '100%' }} step={1000}
                                formatter={value => `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : 0}
                            />
                        )}
                    </Form.Item>
                    <Form.Item label='Images'>
                        {getFieldDecorator('images', {
                            valuePropName: 'images',
                        })(
                            <Upload
                                name='images' listType='picture-card'
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
                                onChange={({ fileList }) => {
                                    setImages(fileList);
                                }}
                                beforeUpload={(_, fileList) => {
                                    setImages(fileList);

                                    return false;
                                }}
                                fileList={images}
                            >
                                <div>
                                    <Icon type='plus' />
                                    <div className='ant-upload-text'>Add</div>
                                </div>
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

export { dishForm as DishForm };
