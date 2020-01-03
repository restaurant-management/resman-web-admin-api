import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { Warehouse } from '../../models/warehouse';
import { Repository } from '../../repository';
import { WarehouseService } from '../../service/warehouse.service';
import { WarehouseForm } from './warehouseForm';

export function WarehousePage() {
    const [showForm, setShowForm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [edited, setEdited] = useState<Warehouse>();

    const loadData = () => {
        setLoading(true);
        WarehouseService.getAll(Repository.token).then((data) => {
            setWarehouses(data);
            setLoading(false);
        })
            .catch(e => {
                enqueueSnackbar(e.toString(), { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(loadData, []);

    return <Scaffold title={'Ware house manager'} subTitle={'Add, edit or delete ware house'} icon={'database'}>
        <div className='row'>
            <div className='col-md-12'>
                <WarehouseForm
                    visible={showForm}
                    onCancel={() => setShowForm(false)}
                    onCreate={() => loadData()}
                    warehouse={edited}
                />
                <DataTable<Warehouse>
                    loading={loading}
                    exportFileName={'Warehouse'}
                    onMultiDelete={(async (items) => {
                        try {
                            enqueueSnackbar(await WarehouseService
                                .deleteMany(Repository.token, items.filter(e => !!e.id).map(e => e.id || -1)),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    })}
                    onEdit={async (item) => {
                        if (!item.id) { return; }
                        setLoading(true);
                        WarehouseService.get(Repository.token, item.id)
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
                            enqueueSnackbar(await WarehouseService
                                .delete(Repository.token, item.id),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={warehouses}
                    autoSizeColumns={['name', 'hotline', 'address']}
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
                            headerName: 'Name', field: 'name', cellClass: 'grid-cell-center', tooltipField: 'name',
                            checkboxSelection: true, headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true
                        }, {
                            headerName: 'Hotline', field: 'hotline', minWidth: 100, cellClass: 'grid-cell-center',
                            tooltipField: 'hotline',
                        }, {
                            headerName: 'Address', field: 'address', cellClass: 'grid-cell-center',
                            tooltipField: 'address',
                        }, {
                            headerName: 'Description', field: 'description', cellClass: 'grid-cell-center',
                            tooltipField: 'description',
                        }, {
                            headerName: 'Store', field: 'store', cellClass: 'grid-cell-center',
                            tooltipField: 'store',
                        },
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
