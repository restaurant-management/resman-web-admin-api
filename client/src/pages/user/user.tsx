import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { User } from '../../models/user';
import { Repository } from '../../repository';
import { UserService } from '../../service';
import { CreateModal } from './createModal';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export function UserPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadData = () => {
        setLoading(true);
        Repository.getAllUser().then((data) => {
            setUsers(data);
            setLoading(false);
        })
            .catch(e => {
                enqueueSnackbar(e.toString(), { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(loadData, []);

    return <Scaffold title={'User manager'} subTitle={'Add, edit or delete user'}>
        <div className='row'>
            <div className='col-md-12'>
                <CreateModal
                    onClose={() => setShowCreateModal(false)}
                    showModal={showCreateModal}
                    onSubmit={() => loadData()}
                />
                <DataTable<User>
                    loading={loading}
                    exportFileName={'User'}
                    onView={(item) => console.log(item)}
                    onMultiDelete={(items => console.log(items))}
                    onDelete={(user) => {
                        confirmAlert({
                            title: 'Confirm to delete',
                            message: 'Are you sure to do this.',
                            buttons: [
                                {
                                    label: 'Yes',
                                    onClick: async () => {
                                        try {
                                            enqueueSnackbar(await UserService
                                                    .deleteUser(Repository.token, user.username),
                                                { variant: 'success' });
                                            loadData();
                                        } catch (e) {
                                            enqueueSnackbar(e.toString(), { variant: 'error' });
                                        }
                                    }
                                },
                                {
                                    label: 'No',
                                    onClick: () => alert('Click No')
                                }
                            ]
                        });
                    }}
                    data={users}
                    autoSizeColumns={['username', 'birthday', 'email', 'roles', 'avatar']}
                    header={(<h1><strong>User</strong> Table</h1>)}
                    onCreate={() => setShowCreateModal(true)}
                    onReload={(callback) => {
                        loadData();
                        if (callback) {
                            callback();
                        }
                    }}
                    columnDefs={[
                        {
                            headerName: 'Username', field: 'username',
                            cellClass: 'grid-cell-center', checkboxSelection: true,
                            headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true
                        }, {
                            headerName: 'Email', field: 'email'
                        }, {
                            headerName: 'Avatar', field: 'avatar', sortable: false, filter: false,
                            cellClass: 'grid-cell-center', suppressAutoSize: true,
                            cellRenderer: 'AgImage', tooltipComponent: 'AgImageTooltip',
                            tooltipValueGetter: (params) => params.value
                        }, {
                            headerName: 'Roles', field: 'roles'
                        }, {
                            headerName: 'Birthday', field: 'birthday',
                            cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? moment(params.value).format('DD/MM/YYYY') : ''
                        }, {
                            headerName: 'Address', field: 'address', minWidth: 100,
                            tooltipField: 'address'
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
