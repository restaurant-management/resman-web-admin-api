import { Form, Input, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Store } from '../../models/store';
import { Warehouse } from '../../models/warehouse';
import { Repository } from '../../repository';
import { StoreService } from '../../service/store.service';
import { WarehouseService } from '../../service/warehouse.service';
import { Validator } from '../../utils/validator';

const { Option } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    warehouse?: Warehouse;
    onCancel: any;
    onCreate?: any;
}

const warehouseForm = Form.create<Props>({ name: 'WarehouseForm' })(
    (props: Props) => {
        const { visible, onCancel, onCreate, warehouse } = props;
        const { getFieldDecorator } = props.form;

        const [loading, setLoading] = useState(false);
        const [stores, setStores] = useState<Store[]>([]);
        const { enqueueSnackbar } = useSnackbar();

        useEffect(() => {
            Promise.all([
                StoreService.getAll()
            ]).then(([proStores]) => {
                setStores(proStores);
            }).catch(e => console.log(e));
        }, []);

        const handleSubmit = () => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    setLoading(true);
                    if (!warehouse) {
                        WarehouseService.create(Repository.token, {
                            name: values.name,
                            hotline: values.prefix + values.hotline,
                            address: values.address,
                            description: values.description,
                            storeId: values.store,
                        }).then(() => {
                            enqueueSnackbar('Create Warehouse success', { variant: 'success' });
                            setLoading(false);
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
                        WarehouseService.edit(Repository.token, {
                            id: warehouse.id,
                            name: values.name,
                            hotline: values.prefix + values.hotline,
                            address: values.address,
                            description: values.description,
                            storeId: values.store,
                        }).then(() => {
                            enqueueSnackbar('Edit Warehouse success', { variant: 'success' });
                            setLoading(false);
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
                    {warehouse ? 'Edit' : 'Create'} <strong>Warehouse</strong>
                </h3>}
                okText={warehouse ? 'Save' : 'Create'}
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
                            initialValue: warehouse ? warehouse.name : '',
                            rules: [{ required: true, message: 'Please input name!' }]
                        })(
                            <Input placeholder='Name' />
                        )}
                    </Form.Item>
                    <Form.Item label='Hotline' hasFeedback>
                        {getFieldDecorator('hotline', {
                            initialValue: warehouse && warehouse.hotline
                                ? warehouse.hotline.split('+84')[0] || warehouse.hotline.split('+84')[1] : '',
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
                            initialValue: warehouse ? warehouse.address : '',
                            rules: [{ required: true, message: 'Please input address!' }]
                        })(
                            <Input placeholder='Address' type={'textarea'} />
                        )}
                    </Form.Item>
                    <Form.Item label='Description' hasFeedback>
                        {getFieldDecorator('description', {
                            initialValue: warehouse ? warehouse.address : '',
                        })(
                            <Input placeholder='Description' type={'textarea'} />
                        )}
                    </Form.Item>
                    <Form.Item label='Store' hasFeedback>
                        {getFieldDecorator('store', {
                            initialValue: warehouse && warehouse.storeId ? warehouse.storeId : undefined,
                            rules: [{ required: true, message: 'Please select store' }]
                        })(
                            <Select placeholder='Store'>
                                {stores
                                    .map(e => e.id
                                        ? <Option key={e.id.toString()} value={e.id}>{e.name}</Option>
                                        : null)}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

export { warehouseForm as WarehouseForm };
