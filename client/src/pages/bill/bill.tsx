import { DatePicker, Select } from 'antd';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { Bill } from '../../models/bill';
import { Store } from '../../models/store';
import { Repository } from '../../repository';
import { BillService } from '../../service/bill.service';
import { StoreService } from '../../service/store.service';
import { BillForm } from './billForm';

const { RangePicker } = DatePicker;

const { Option } = Select;

export function BillPage() {
    const [showForm, setShowForm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [bills, setBills] = useState<Bill[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [edited, setEdited] = useState<Bill>();
    const [stores, setStores] = useState<Store[]>();
    const [selectedStore, setSelectedStore] = useState<Store>();
    const [selectedStartDay, setSelectedStartDay] = useState<Date>(moment(new Date()).add(-1, 'week').toDate());
    const [selectedEndDay, setSelectedEndDay] = useState<Date>(new Date());

    const loadData = (storeId?: number, startDay?: Date, endDay?: Date) => {
        const id = storeId ? storeId : (selectedStore && selectedStore.id ? selectedStore.id : undefined);

        if (id) {
            setLoading(true);
            BillService.getAll(Repository.token, id, startDay, endDay).then((data) => {
                setBills(data);
                setLoading(false);
            })
                .catch(e => {
                    enqueueSnackbar(e.toString(), { variant: 'error' });
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        StoreService.getAllOfMe(Repository.token).then((proStores) => {
            setStores(proStores);
            setSelectedStore(proStores[0]);

            return loadData(proStores[0].id);
        }).catch(e => {
            enqueueSnackbar(e.toString(), { variant: 'error' });
        });
    }, []);

    return (<Scaffold title={'Bill manager'} subTitle={'Add, edit or delete bill'} icon={'file-done'}>
        <div className='row'>
            <div className='col-md-12'>
                {selectedStore && (
                    <BillForm
                        store={selectedStore}
                        visible={showForm}
                        onCancel={() => setShowForm(false)}
                        onCreate={() => loadData()}
                        bill={edited}
                    />
                )}
                <DataTable<Bill>
                    actions={[
                        (
                            <RangePicker
                                key={0}
                                format={'DD/MM/YYYY'}
                                className={'resman-date-picker'}
                                size={'small'}
                                allowClear={false}
                                ranges={{
                                    'Today': [moment(), moment()],
                                    'This Week': [moment().startOf('week'), moment().endOf('week')],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                    'Last 7 days': [moment().add(-1, 'week'), moment()],
                                    'Last 30 days': [moment().add(-30, 'days'), moment()]
                                }}
                                value={[moment(selectedStartDay), moment(selectedEndDay)]}
                                onChange={([start, end]) => {
                                    if (start) {
                                        setSelectedStartDay(start.toDate());
                                    }
                                    if (end) {
                                        setSelectedEndDay(end.toDate());
                                    }

                                    loadData(undefined,
                                        start ? start.toDate() : undefined, end ? end.toDate() : undefined);
                                }}
                                style={{ marginRight: 10, width: 230 }}
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
                                        setSelectedStore(stores.find(e => e.id === value));
                                        loadData(value);
                                    }
                                }}
                            >
                                {(stores || []).map(e => e.id
                                    ? <Option key={e.id.toString()} value={e.id}>{e.name}</Option>
                                    : null)}
                            </Select>
                        )]}
                    loading={loading}
                    exportFileName={'Bill'}
                    suppressSizeColumnsToFit
                    onEdit={async (item) => {
                        if (!item.id) {
                            return;
                        }
                        setLoading(true);
                        BillService.get(Repository.token, item.id)
                            .then(async (data) => {
                                setEdited(data);
                                setShowForm(true);
                                setLoading(false);
                            })
                            .catch((e) => {
                                setLoading(false);
                                enqueueSnackbar(e.toString(), { variant: 'error' });
                            });
                    }}
                    onDelete={async (item: Bill) => {
                        try {
                            if (!item.id) {
                                return;
                            }
                            enqueueSnackbar(await BillService.delete(Repository.token, item.id),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={bills}
                    autoSizeColumns={['id', 'tableNumber']}
                    onCreate={() => {
                        setShowForm(true);
                        setEdited(undefined);
                    }}
                    onReload={(callback) => {
                        loadData();
                        if (callback) {
                            callback();
                        }
                    }}
                    columnDefs={[
                        {
                            headerName: 'Id', field: 'id',
                            cellClass: 'grid-cell-center'
                        }, {
                            headerName: 'Table', field: 'tableNumber', cellClass: 'grid-cell-center'
                        }, {
                            headerName: 'Create At', field: 'createAt', cellClass: 'grid-cell-center',
                            tooltipField: 'createAt', cellRenderer: (params) =>
                                params.value ? moment(params.value).format('DD/MM/YYYY HH:mm:ss') : ''
                        }, {
                            headerName: 'Create by', field: 'createBy.username', cellClass: 'grid-cell-center',
                            tooltipField: 'createBy.username'
                        }, {
                            headerName: 'Prepare At', field: 'prepareAt', cellClass: 'grid-cell-center',
                            tooltipField: 'prepareAt', cellRenderer: (params) =>
                                params.value ? moment(params.value).format('DD/MM/YYYY HH:mm:ss') : ''
                        }, {
                            headerName: 'Prepare by', field: 'prepareBy.username', cellClass: 'grid-cell-center',
                            tooltipField: 'prepareBy.username'
                        }, {
                            headerName: 'Collect At', field: 'collectAt', cellClass: 'grid-cell-center',
                            tooltipField: 'collectAt', cellRenderer: (params) =>
                                params.value ? moment(params.value).format('DD/MM/YYYY HH:mm:ss') : ''
                        }, {
                            headerName: 'Collect by', field: 'collectBy.username', cellClass: 'grid-cell-center',
                            tooltipField: 'collectBy.username'
                        }, {
                            headerName: 'Collect', field: 'collectValue', cellClass: 'grid-cell-center',
                            tooltipField: 'collectValue'
                        }, {
                            headerName: 'Customer', field: 'customer.username', cellClass: 'grid-cell-center',
                            tooltipField: 'customer.username'
                        }, {
                            headerName: 'Voucher Code', field: 'voucherCode', cellClass: 'grid-cell-center',
                            tooltipField: 'voucherCode'
                        }, {
                            headerName: 'Voucher Value', field: 'voucherValue', cellClass: 'grid-cell-center'
                        }, {
                            headerName: 'Discount Code', field: 'discountCode', cellClass: 'grid-cell-center',
                            tooltipField: 'discountCode'
                        }, {
                            headerName: 'Discount Value', field: 'discountValue', cellClass: 'grid-cell-center'
                        }, {
                            headerName: 'Rating', field: 'rating', cellClass: 'grid-cell-center'
                        }, {
                            headerName: 'Note', field: 'note'
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>);
}
