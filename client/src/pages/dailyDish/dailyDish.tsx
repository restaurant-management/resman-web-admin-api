import { DatePicker, Select } from 'antd';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { DailyDish } from '../../models/dailyDish';
import { Store } from '../../models/store';
import { Repository } from '../../repository';
import { DailyDishService } from '../../service/dailyDish.service';
import { StoreService } from '../../service/store.service';
import { DailyDishForm } from './dailyDishForm';

const { Option } = Select;

export function DailyDishPage() {
    const [showForm, setShowForm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [dailyDishes, setDailyDishes] = useState<DailyDish[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedStore, setSelectedStore] = useState<Store>();
    const [selectedDay, setSelectedDay] = useState<Date>(new Date());
    const [stores, setStores] = useState<Store[]>();

    const loadData = async (storeId?: number, day?: Date) => {
        const id = storeId ? storeId : (selectedStore && selectedStore.id ? selectedStore.id : undefined);

        if (id) {
            await DailyDishService.getAll(Repository.token, day || selectedDay || new Date(), id)
                .then((data) => {
                    setDailyDishes(data);
                });
        }
    };

    useEffect(() => {
        setLoading(true);
        StoreService.getAll().then((proStores) => {
            setStores(proStores);
            setSelectedStore(proStores[0]);

            return loadData(proStores[0].id);
        }).then((_) => setLoading(false))
            .catch(e => {
                setLoading(false);
                enqueueSnackbar(e.toString(), { variant: 'error' });
            });
    }, []);

    return <Scaffold title={'Daily Dish manager'} subTitle={'Add, edit or delete daily dish'} icon={'profile'}>
        <div className='row'>
            <div className='col-md-12'>
                {selectedStore && (
                    <DailyDishForm
                        visible={showForm}
                        onCancel={() => setShowForm(false)}
                        onCreate={() => loadData()}
                        store={selectedStore}
                        dailyDishes={dailyDishes}
                    />
                )}
                <DataTable<DailyDish>
                    actions={[
                        (
                            <DatePicker
                                key={0}
                                format={'DD/MM/YYYY'}
                                className={'resman-date-picker'}
                                size={'small'}
                                allowClear={false}
                                value={moment(selectedDay)}
                                onChange={value => {
                                    if (value) {
                                        setSelectedDay(value.toDate());
                                        setLoading(true);
                                        loadData(undefined, value.toDate()).then((_) => setLoading(false))
                                            .catch(e => {
                                                setLoading(false);
                                                enqueueSnackbar(e.toString(), { variant: 'error' });
                                            });
                                    }
                                }}
                                style={{ marginRight: 10, width: 150 }}
                            />
                        ), (
                            <Select
                                key={1}
                                className={'resman-select'}
                                size={'default'}
                                style={{ width: 100, marginRight: 10 }}
                                placeholder='Store'
                                value={selectedStore && selectedStore.id ? selectedStore.id : undefined}
                                onChange={(value: any) => {
                                    if (stores) {
                                        setLoading(true);
                                        setSelectedStore(stores.find(e => e.id === value));
                                        loadData(value).then((_) => setLoading(false))
                                            .catch(e => {
                                                setLoading(false);
                                                enqueueSnackbar(e.toString(), { variant: 'error' });
                                            });
                                    }
                                }}
                            >
                                {(stores || []).map(e => e.id
                                    ? <Option key={e.id.toString()} value={e.id}>{e.name}</Option>
                                    : null)}
                            </Select>
                        )]}
                    loading={loading}
                    exportFileName={'Daily Dish'}
                    confirmEdit={true} confirmEditTitle={'Are you sure to confirm dish out of stock?'}
                    editButtonIcon={'exception'}
                    onMultiDelete={async (items) => {
                        try {
                            if (!items[0] || !items[0].day || !items[0].storeId) { return; }
                            enqueueSnackbar(await DailyDishService
                                .deleteMany(
                                    Repository.token, items[0].day, items.map(item => item.dishId), items[0].storeId
                                ),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    onEdit={async (item) => {
                        try {
                            if (!item.storeId || item.confirmAt) { return; }
                            setLoading(true);
                            enqueueSnackbar(await DailyDishService
                                .confirm(Repository.token, item.day, item.dishId, item.storeId),
                                { variant: 'success' });
                            await loadData(item.storeId);
                            setLoading(false);
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    onDelete={async (item) => {
                        try {
                            if (!item.storeId) { return; }
                            setLoading(true);
                            enqueueSnackbar(await DailyDishService
                                .delete(Repository.token, item.day, item.dishId, item.storeId),
                                { variant: 'success' });
                            await loadData(item.storeId);
                            setLoading(false);
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={dailyDishes}
                    autoSizeColumns={['dishName', 'dishPrice', 'confirmAt', 'confirmBy']}
                    onCreate={() => {
                        setShowForm(true);
                    }}
                    onReload={(callback) => {
                        loadData();
                        if (callback) {
                            callback();
                        }
                    }}
                    columnDefs={[
                        {
                            headerName: 'Dish', field: 'dishName', cellClass: 'grid-cell-center',
                            tooltipField: 'dishName', checkboxSelection: true, headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true
                        }, {
                            headerName: 'Price', field: 'dishPrice', minWidth: 100, cellClass: 'grid-cell-center',
                            tooltipField: 'dishPrice',
                        }, {
                            headerName: 'Out of stock', field: 'confirmAt', minWidth: 100,
                            cellClass: 'grid-cell-center', tooltipField: 'confirmAt',
                            cellRenderer: (params) => params.value ?
                                moment(params.value).format('DD/MM/YYYY HH:mm:ss') : ''
                        }, {
                            headerName: 'ConfirmBy', field: 'confirmBy', minWidth: 100, cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? params.value.username : ''
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
