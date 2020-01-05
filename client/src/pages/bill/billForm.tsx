import { Button, DatePicker, Form, Icon, InputNumber, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Bill } from '../../models/bill';
import { Dish } from '../../models/dish';
import { Store } from '../../models/store';
import { User } from '../../models/user';
import { Repository } from '../../repository';
import { UserService } from '../../service';
import { BillService } from '../../service/bill.service';
import { DishService } from '../../service/dish.service';

const { Option } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    bill?: Bill;
    store: Store;
    onCancel: any;
    onCreate?: any;
}

const billForm = Form.create<Props>({ name: 'BillForm' })(
    (props: Props) => {
        const { visible, onCancel, onCreate, bill, store } = props;
        const { getFieldDecorator, getFieldValue } = props.form;

        const [loading, setLoading] = useState(false);
        const [dishes, setDishes] = useState<Dish[]>([]);
        const [staffs, setStaffs] = useState<User[]>([]);
        const [chefs, setChefs] = useState<User[]>([]);
        const { enqueueSnackbar } = useSnackbar();

        useEffect(() => {
            Promise.all([
                DishService.getAll(Repository.token, store.id),
                UserService.getAllByRole(Repository.token, ['staff']),
                UserService.getAllByRole(Repository.token, ['chef'])
            ]).then(([proDishes, proStaffs, proChefs]) => {
                setDishes(proDishes);
                setStaffs(proStaffs);
                setChefs(proChefs);
            }).catch(e => enqueueSnackbar(e.toString(), { variant: 'error' }));
        }, [store]);

        const handleSubmit = () => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    setLoading(true);
                    if (!bill) {
                        BillService.create(Repository.token, {
                            ...values,
                            storeId: store.id,
                            tableNumber: values.tableNumber,
                            dishes: values.dishIds.map((e: any, i: number) => ({
                                dishId: parseInt(e, 10),
                                quantity: parseInt(values.dishQuantities[i], 10)
                            })),
                            createBy: {
                                uuid: values.createBy
                            },
                            prepareBy: {
                                uuid: values.prepareBy
                            },
                            collectBy: {
                                uuid: values.collectBy
                            },
                            collectValue: parseFloat(values.collectValue)
                        }).then(() => {
                            enqueueSnackbar('Create Bill success', { variant: 'success' });
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
                        BillService.edit(Repository.token, {
                            ...values,
                            id: bill.id,
                            storeId: store.id,
                            tableNumber: values.tableNumber,
                            dishes: values.dishIds.map((e: any, i: number) => ({
                                dishId: parseInt(e, 10),
                                quantity: parseInt(values.dishQuantities[i], 10)
                            })),
                            createBy: {
                                uuid: values.createBy
                            },
                            prepareBy: {
                                uuid: values.prepareBy
                            },
                            collectBy: {
                                uuid: values.collectBy
                            },
                            collectValue: parseFloat(values.collectValue)
                        }).then(() => {
                            enqueueSnackbar('Edit Bill success', { variant: 'success' });
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
                    {bill ? 'Edit' : 'Create'} <strong>Bill</strong>
                </h3>}
                okText={bill ? 'Save' : 'Create'}
                onCancel={onCancel}
                destroyOnClose
                onOk={() => {
                    handleSubmit();
                }}
            >
                <OverlayIndicator show={loading} />
                <Form>
                    <Form.Item label='Table' hasFeedback>
                        {getFieldDecorator('tableNumber', {
                            initialValue: bill ? bill.tableNumber : '',
                            rules: [{ required: true, message: 'Please input table number!' }]
                        })(
                            <InputNumber min={1} step={1} style={{ width: '100%' }} placeholder={'Table number'} />
                        )}
                    </Form.Item>
                    {getFieldDecorator('billDishKeys', {
                        initialValue: bill && bill.dishes ? bill.dishes.map((it, i) => i) : [0]
                    })}
                    {
                        getFieldValue('billDishKeys').map((item: number, index: number) => {
                            const billDish = bill && bill.dishes ? bill.dishes[item] : undefined;

                            return (
                                <Form.Item
                                    label={index === 0 ? 'Dishes' : ''}
                                    required={true}
                                    key={index}
                                >
                                    {getFieldDecorator(`dishIds[${item}]`, {
                                        validateTrigger: ['onChange', 'onBlur'],
                                        initialValue: billDish ? billDish.dishId : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select dish or delete this field.'
                                            }
                                        ]
                                    })(<Select
                                        placeholder='Dish' style={{ width: '50%', marginRight: 10 }}
                                        onChange={(value: number) => {
                                            if (dishes) {
                                                const dish = dishes.find(e => e.id === value);
                                                if (dish) {
                                                    props.form.setFieldsValue({
                                                        [`dishPrices[${item}]`]: dish.price || dish.defaultPrice
                                                    });
                                                }

                                                const quantities = getFieldValue('dishQuantities');
                                                if (!quantities[item]) {
                                                    props.form.setFieldsValue({
                                                        [`dishQuantities[${item}]`]: 1
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
                                        initialValue: billDish ? billDish.price : undefined
                                    })(
                                        <InputNumber
                                            disabled={true} placeholder={'Price'}
                                            min={0} style={{ width: '20%', marginRight: 10 }} step={1000}
                                        />
                                    )}
                                    {getFieldDecorator(`dishQuantities[${item}]`, {
                                        validateTrigger: ['onChange', 'onBlur'],
                                        initialValue: billDish ? billDish.price : undefined,
                                        rules: [
                                            {
                                                required: true,
                                                message: 'Please select quantity or delete this field.'
                                            }
                                        ]
                                    })(
                                        <InputNumber
                                            placeholder={'Quantity'} aria-label={'Quantity'}
                                            min={1} style={{ width: '20%', marginRight: 10 }} step={1}
                                        />
                                    )}
                                    {index !== 0 && (
                                        <Icon
                                            className='dynamic-delete-button'
                                            type='minus-circle-o'
                                            onClick={() => {
                                                const billDishKeys: number[] = getFieldValue('billDishKeys') || [];
                                                props.form.setFieldsValue({
                                                    billDishKeys: billDishKeys.filter(key => key !== item)
                                                });
                                            }}
                                        />
                                    )}
                                </Form.Item>
                            );
                        })
                    }
                    <Form.Item>
                        <Button type='dashed' style={{ width: '100%' }}
                                onClick={() => {
                                    const billDishKeys: number[] = getFieldValue('billDishKeys') || [];
                                    props.form.setFieldsValue({
                                        billDishKeys: [...billDishKeys, billDishKeys.length]
                                    });
                                }}
                        >
                            <Icon type='plus' />{` Add dish`}
                        </Button>
                    </Form.Item>
                    <Form.Item label='Create At'>
                        {getFieldDecorator('createAt', {
                            initialValue: moment(bill ? bill.createAt : new Date())
                        })(<DatePicker
                            style={{ width: '100%' }}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            format={'DD/MM/YYYY HH:mm:ss'}
                        />)}
                    </Form.Item>
                    <Form.Item label='Select Staff created' hasFeedback>
                        {getFieldDecorator('createBy', {
                            initialValue: bill && bill.createBy ? bill.createBy.uuid : undefined,
                            rules: [{ required: true, message: 'Please select store' }]
                        })(
                            <Select placeholder='Store'>
                                {staffs
                                    .map(e => e.uuid
                                        ? <Option key={e.uuid.toString()} value={e.uuid}>
                                            {e.username}
                                        </Option>
                                        : null)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label='Prepare At'>
                        {getFieldDecorator('prepareAt', {
                            initialValue: bill && bill.prepareAt ? moment(bill.prepareAt) : undefined
                        })(<DatePicker
                            style={{ width: '100%' }}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            format={'DD/MM/YYYY HH:mm:ss'}
                        />)}
                    </Form.Item>
                    <Form.Item label='Select chef prepared' hasFeedback>
                        {getFieldDecorator('prepareBy', {
                            initialValue: bill && bill.prepareBy ? bill.prepareBy.uuid : undefined
                        })(
                            <Select placeholder='Prepare By'>
                                {chefs
                                    .map(e => e.uuid
                                        ? <Option key={e.uuid.toString()} value={e.uuid}>
                                            {e.username}
                                        </Option>
                                        : null)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label='Collect At'>
                        {getFieldDecorator('collectAt', {
                            initialValue: bill && bill.collectAt ? moment(bill.collectAt) : undefined
                        })(<DatePicker
                            style={{ width: '100%' }}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                            format={'DD/MM/YYYY HH:mm:ss'}
                        />)}
                    </Form.Item>
                    <Form.Item label='Select staff collected' hasFeedback>
                        {getFieldDecorator('collectBy', {
                            initialValue: bill && bill.collectBy ? bill.collectBy.uuid : undefined
                        })(
                            <Select placeholder='Collect By'>
                                {staffs
                                    .map(e => e.uuid
                                        ? <Option key={e.uuid.toString()} value={e.uuid}>
                                            {e.username}
                                        </Option>
                                        : null)}
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item label='Collect Value' hasFeedback>
                        {getFieldDecorator('collectValue', {
                            initialValue: bill ? bill.collectValue : ''
                        })(
                            <InputNumber min={1} step={1} style={{ width: '100%' }} placeholder={'Collect Value'} />
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

export { billForm as BillForm };
