import { DatePicker, Select } from 'antd';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import OverlayIndicator from '../components/overlayIndicator';
import Scaffold from '../components/scaffold';
import { Store } from '../models/store';
import { Repository } from '../repository';
import { BillService } from '../service/bill.service';
import { StoreService } from '../service/store.service';

const { RangePicker } = DatePicker;

const { Option } = Select;

export default function DashBoard() {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<Array<{day: Date, count: number, countD: number}>>();
    const [stores, setStores] = useState<Store[]>();
    const [selectedStore, setSelectedStore] = useState<Store>();
    const [selectedStartDay, setSelectedStartDay] = useState<Date>(moment(new Date()).add(-1, 'week').toDate());
    const [selectedEndDay, setSelectedEndDay] = useState<Date>(new Date());
    const { enqueueSnackbar } = useSnackbar();

    const loadData = (storeId?: number, startDay?: Date, endDay?: Date) => {
        const id = storeId ? storeId : (selectedStore && selectedStore.id ? selectedStore.id : undefined);
        const startD = startDay ? startDay : (selectedStartDay || moment(new Date()).add(-1, 'week').toDate());
        const endD = endDay ? endDay : (selectedEndDay || new Date());

        if (id) {
            setLoading(true);
            BillService.countBill(Repository.token, id, startD, endD).then((d) => {
                setData(d);
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

    return <Scaffold title={'Dashboard'}>
        <div className='row'>
            <div className='col-md-12'>
                <section className='tile color transparent-black'>
                    <OverlayIndicator show={loading} />
                    <div className='tile-header'>
                        <div className='row' style={{ paddingTop: 10 }}>
                            <div className='col-md-4'>
                                <h1><strong>{'Dashboard'}</strong></h1>
                            </div>
                            <div className='col-md-8'>
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
                                    onChange={([startD, endD]) => {
                                        if (startD) {
                                            setSelectedStartDay(startD.toDate());
                                        }
                                        if (endD) {
                                            setSelectedEndDay(endD.toDate());
                                        }

                                        loadData(undefined,
                                            startD ? startD.toDate() : undefined, endD ? endD.toDate() : undefined);
                                    }}
                                    style={{ marginRight: 10, width: 230 }}
                                />
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
                            </div>
                        </div>
                        <div className='controls'>
                            <Link to='#' className='minimize'>
                                <i className='fa fa-chevron-down' />
                            </Link>
                            <Link onClick={() => loadData()} to='#'>
                                <i className='fa fa-refresh' />
                            </Link>
                            <Link to='#' className='remove'><i className='fa fa-times' /></Link>
                        </div>
                    </div>
                    <Chart
                        options={{
                            chart: {
                                id: 'Bill Report'
                            },
                            xaxis: {
                                categories: data ? data.map(e => moment(e.day).format('DD/MM/YYYY')) : [],
                            }, theme: {
                                monochrome: {
                                    enabled: true,
                                    color: '#255aee',
                                    shadeTo: 'light',
                                    shadeIntensity: 0.65
                                }
                            },
                            tooltip: {
                                theme: 'dark'
                            }
                        }}
                        series={[
                            {
                                name: 'Bill',
                                data: data ? data.map(e => e.count) : []
                            },
                            {
                                name: 'Delivery Bill',
                                data: data ? data.map(e => e.countD) : []
                            },
                        ]}
                        type='bar'
                    />
                </section>
            </div>
        </div>
    </Scaffold>;
}
