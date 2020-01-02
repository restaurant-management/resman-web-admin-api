import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { Role } from '../../models/role';
import { Repository } from '../../repository';
import { RoleService } from '../../service/role.service';
import { RoleForm } from './roleForm';

export function RolePage() {
    const [showForm, setShowForm] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [edited, setEdited] = useState<Role>();

    const loadData = () => {
        setLoading(true);
        RoleService.getAll(Repository.token).then((data) => {
            setRoles(data);
            setLoading(false);
        })
            .catch(e => {
                enqueueSnackbar(e.toString(), { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(loadData, []);

    return <Scaffold title={'Role manager'} subTitle={'Add, edit or delete role'} icon={'safety'}>
        <div className='row'>
            <div className='col-md-12'>
                <RoleForm
                    visible={showForm}
                    onCancel={() => setShowForm(false)}
                    onCreate={() => loadData()}
                    role={edited}
                />
                <DataTable<Role>
                    loading={loading}
                    exportFileName={'Role'}
                    onMultiDelete={(async (items) => {
                        try {
                            enqueueSnackbar(await RoleService
                                .deleteMany(Repository.token, items.filter(e => !!e.slug).map(e => e.slug || '')),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    })}
                    onEdit={async (item) => {
                        if (!item.slug) { return; }
                        setLoading(true);
                        RoleService.get(Repository.token, item.slug)
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
                            if (!item.slug) { return; }
                            enqueueSnackbar(await RoleService
                                .delete(Repository.token, item.slug),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={roles}
                    autoSizeColumns={['name', 'slug', 'description', 'level']}
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
                            headerName: 'Slug', field: 'slug', cellClass: 'grid-cell-center', tooltipField: 'name',
                            checkboxSelection: true, headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true
                        }, {
                            headerName: 'Name', field: 'name', minWidth: 100, cellClass: 'grid-cell-center',
                            tooltipField: 'name',
                        }, {
                            headerName: 'Description', field: 'description', cellClass: 'grid-cell-center',
                            tooltipField: 'description', minWidth: 100,
                        }, {
                            headerName: 'Level', field: 'level', cellClass: 'grid-cell-center', minWidth: 100
                        }, {
                            headerName: 'Permissions', field: 'permissions', cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? params.value.join(', ') : '',
                            tooltipField: 'permissions'
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
