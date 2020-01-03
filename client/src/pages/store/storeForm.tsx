import { Button, Form, Icon, Input, InputNumber, Modal, Select, TimePicker, Upload } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Dish } from '../../models/dish';
import { Store } from '../../models/store';
import { Repository } from '../../repository';
import { DishService } from '../../service/dish.service';
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
        const { getFieldDecorator, getFieldValue } = props.form;

        const [loading, setLoading] = useState(false);
        const [logo, setLogo] = useState<File>();
        const [dishes, setDishes] = useState<Dish[]>([]);
        const [imagePreview, setImagePreview] = useState<any>('');
        const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
        const { enqueueSnackbar } = useSnackbar();

        useEffect(() => {
            Promise.all([
                DishService.getAll(Repository.token)
            ]).then(([proDishes]) => {
                setDishes(proDishes);
            }).catch(e => console.log(e));
        }, []);

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
                            closeTime: values.closeTime ? (values.closeTime as Moment).toDate() : undefined,
                            storeDishes: values.dishIds.map((e: number, i: number) => ({
                                dishId: e,
                                price: values.dishPrices[i] || 0
                            }))
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
                            closeTime: values.closeTime ? (values.closeTime as Moment).toDate() : undefined,
                            storeDishes: values.dishIds.filter((e: any) => !!e).map((e: number, i: number) => ({
                                dishId: e,
                                price: values.dishPrices[i] || 0
                            }))
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

        const storeDishes = store ? store.storeDishes : undefined;

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
                    {getFieldDecorator('storeDishKeys', {
                        initialValue: store && store.storeDishes ? store.storeDishes.map((it, i) => i) : []
                    })}
                    {
                        getFieldValue('storeDishKeys').map((item: number, index: number) => {
                            const storeDish = storeDishes ? storeDishes[item] : undefined;

                            return (
                                <Form.Item
                                    label={index === 0 ? 'Dishes' : ''}
                                    required={false}
                                    key={index}
                                >
                                    {getFieldDecorator(`dishIds[${item}]`, {
                                        validateTrigger: ['onChange', 'onBlur'],
                                        initialValue: storeDish ? storeDish.dishId : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select dish or delete this field.',
                                            },
                                        ],
                                    })(<Select
                                        placeholder='Store' style={{ width: '60%', marginRight: 10 }}
                                        onChange={(value: number) => {
                                            if (dishes) {
                                                const dish = dishes.find(e => e.id === value);
                                                if (dish) {
                                                    props.form.setFieldsValue({
                                                        [`dishPrices[${item}]`]: dish.defaultPrice,
                                                    });
                                                }
                                            }
                                        }}
                                    >
                                        {dishes
                                            .map(e => e.id
                                                ? <Option
                                                    key={e.id.toString()} value={e.id}
                                                    disabled={getFieldValue('dishIds') &&
                                                        getFieldValue('dishIds').find((e2: any) => e2 === e.id)}
                                                >
                                                    {e.name}
                                                </Option>
                                                : null)}
                                    </Select>)}
                                    {getFieldDecorator(`dishPrices[${item}]`, {
                                        validateTrigger: ['onChange', 'onBlur'],
                                        initialValue: storeDish
                                            ? (storeDish.price
                                                ? storeDish.price
                                                : (storeDish.dish && storeDish.dish.defaultPrice
                                                    ? storeDish.dish.defaultPrice : 0))
                                            : 0,
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please input money.',
                                            },
                                        ],
                                    })(
                                        <InputNumber
                                            min={0} style={{ width: '30%', marginRight: 10 }} step={1000}
                                            formatter={value => `${value} VNĐ`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : 0}
                                        />
                                    )}
                                    <Icon
                                        className='dynamic-delete-button'
                                        type='minus-circle-o'
                                        onClick={() => {
                                            const storeDishKeys: number[] = getFieldValue('storeDishKeys') || [];
                                            props.form.setFieldsValue({
                                                storeDishKeys: storeDishKeys.filter(key => key !== item),
                                            });
                                        }}
                                    />
                                </Form.Item>
                            );
                        })
                    }
                    <Form.Item>
                        <Button type='dashed' style={{ width: '100%' }}
                            onClick={() => {
                                const storeDishKeys: number[] = getFieldValue('storeDishKeys') || [];
                                props.form.setFieldsValue({
                                    storeDishKeys: [...storeDishKeys, storeDishKeys.length]
                                });
                            }}
                        >
                            <Icon type='plus' />{` Add dish`}
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

export { storeForm as StoreForm };
