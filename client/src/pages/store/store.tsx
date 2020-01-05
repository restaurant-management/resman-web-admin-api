import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { Store } from '../../models/store';
import { Repository } from '../../repository';
import { StoreService } from '../../service/store.service';
import { StoreForm } from './storeForm';

export function StorePage() {
    const [showForm, setShowForm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [edited, setEdited] = useState<Store>();

    const loadData = () => {
        setLoading(true);
        StoreService.getAllOfMe(Repository.token).then((data) => {
            setStores(data);
            setLoading(false);
        })
            .catch(e => {
                enqueueSnackbar(e.toString(), { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(loadData, []);

    return <Scaffold title={'Store manager'} subTitle={'Add, edit or delete store'} icon={'shop'}>
        <div className='row'>
            <div className='col-md-12'>
                <StoreForm
                    visible={showForm}
                    onCancel={() => setShowForm(false)}
                    onCreate={() => loadData()}
                    store={edited}
                />
                <DataTable<Store>
                    loading={loading}
                    exportFileName={'Store'}
                    onEdit={async (item) => {
                        if (!item.id) { return; }
                        setLoading(true);
                        StoreService.get(Repository.token, item.id)
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
                    onDelete={async (item) => {
                        try {
                            if (!item.id) { return; }
                            enqueueSnackbar(await StoreService
                                .delete(Repository.token, item.id),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={stores}
                    autoSizeColumns={['name', 'hotline', 'address', 'closeTime', 'openTime', 'amountDishes', 'logo']}
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
                            headerName: 'Logo', field: 'logo', sortable: false, filter: false,
                            cellClass: 'grid-cell-center', suppressAutoSize: true,
                            cellRenderer: 'AgImage', tooltipComponent: 'AgImageTooltip',
                            tooltipValueGetter: (params) => params.value
                        }, {
                            headerName: 'Name', field: 'name', cellClass: 'grid-cell-center', tooltipField: 'name',
                        }, {
                            headerName: 'Hotline', field: 'hotline', minWidth: 100, cellClass: 'grid-cell-center',
                            tooltipField: 'hotline',
                        }, {
                            headerName: 'Address', field: 'address', cellClass: 'grid-cell-center',
                            tooltipField: 'address',
                        }, {
                            headerName: 'Open Time', field: 'openTime', cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? moment(params.value).format('HH:mm') : ''
                        }, {
                            headerName: 'Close Time', field: 'closeTime', cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? moment(params.value).format('HH:mm') : ''
                        }, {
                            headerName: 'Dishes', field: 'amountDishes', cellClass: 'grid-cell-center',
                            cellRenderer: (params) => (params.value || 0) + ' dishes'
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
