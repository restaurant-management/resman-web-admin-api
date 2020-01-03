import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { Dish } from '../../models/dish';
import { Repository } from '../../repository';
import { DishService } from '../../service/dish.service';
import { DishForm } from './dishForm';

export function DishPage() {
    const [showForm, setShowForm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [edited, setEdited] = useState<Dish>();

    const loadData = () => {
        setLoading(true);
        DishService.getAll(Repository.token).then((data) => {
            setDishes(data);
            setLoading(false);
        })
            .catch(e => {
                enqueueSnackbar(e.toString(), { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(loadData, []);

    return <Scaffold title={'Dish manager'} subTitle={'Add, edit or delete dish'} icon={'gold'}>
        <div className='row'>
            <div className='col-md-12'>
                <DishForm
                    visible={showForm}
                    onCancel={() => setShowForm(false)}
                    onCreate={() => loadData()}
                    dish={edited}
                />
                <DataTable<Dish>
                    loading={loading}
                    exportFileName={'Dish'}
                    onMultiDelete={(async (items) => {
                        try {
                            enqueueSnackbar(await DishService
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
                        DishService.get(Repository.token, item.id)
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
                            enqueueSnackbar(await DishService
                                .delete(Repository.token, item.id),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={dishes}
                    autoSizeColumns={['name', 'images', 'defaultPrice']}
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
                            headerName: 'Image', field: 'images', sortable: false, filter: false,
                            cellClass: 'grid-cell-center', suppressAutoSize: true,
                            cellRenderer: 'AgImages', tooltipComponent: 'AgImagesTooltip',
                            tooltipValueGetter: (params) => params.value,
                        }, {
                            headerName: 'Description', field: 'description', cellClass: 'grid-cell-center',
                            tooltipField: 'description', minWidth: 100,
                        }, {
                            headerName: 'Price', field: 'defaultPrice', cellClass: 'grid-cell-center', minWidth: 100
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
