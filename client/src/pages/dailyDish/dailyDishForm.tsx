import { Form, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { DailyDish } from '../../models/dailyDish';
import { Dish } from '../../models/dish';
import { Store } from '../../models/store';
import { Repository } from '../../repository';
import { DailyDishService } from '../../service/dailyDish.service';
import { DishService } from '../../service/dish.service';

const { Option } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    store: Store;
    dailyDishes: DailyDish[];
    onCancel: any;
    onCreate?: any;
}

const dailyDishForm = Form.create<Props>({ name: 'DailyDishForm' })(
    (props: Props) => {
        const { visible, onCancel, onCreate, store, dailyDishes } = props;
        const { getFieldDecorator } = props.form;

        const [loading, setLoading] = useState(false);
        const [dishes, setDishes] = useState<Dish[]>([]);
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
                    if (!store.id) { return; }
                    setLoading(true);
                    DailyDishService.create(Repository.token, store.id, new Date(), values.dishes).then(() => {
                        enqueueSnackbar('Create DailyDish success', { variant: 'success' });
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
                }
            });
        };

        return (
            <Modal
                visible={visible}
                title={<h3 className='modal-title'>
                    {'Add'} <strong>Today Dish</strong>{'\nFor store '} <strong>{store.name}</strong>
                </h3>}
                okText={'Create'}
                onCancel={onCancel}
                destroyOnClose
                onOk={() => {
                    handleSubmit();
                }}
            >
                <OverlayIndicator show={loading} />
                <Form>
                    <Form.Item label='Dishes' hasFeedback>
                        {getFieldDecorator('dishes', {
                            rules: [{ required: true, message: 'Please select dish' }]
                        })(
                            <Select mode='multiple' placeholder='Stores'>
                                {dishes
                                    .map(e => e.id
                                        ? <Option
                                            key={e.id.toString()}
                                            value={e.id}
                                            disabled={!!dailyDishes.find(e2 => e2.dishId === e.id)}
                                        >
                                            {e.name}
                                        </Option>
                                        : null)}
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

export { dailyDishForm as DailyDishForm };
