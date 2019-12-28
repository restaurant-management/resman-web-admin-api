import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import React, { useState } from 'react';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { GraphQuery } from '../../lib/graphQuery';
import { User } from '../../models/user';
import { CreateModal } from './createModal';

export function UserPage() {
    const [showModal, setShowModal] = useState(false);
    const { loading, data, refetch } = useQuery(GraphQuery.GET_USER);

    let users: User[] = [];
    if (data && data.users) {
        users = data.users.map((e: any) => User.fromJson(e));
    }

    return <Scaffold title={'User manager'} subTitle={'Add, edit or delete user'}>
        <div className='row'>
            <div className='col-md-12'>
                <CreateModal onClose={() => setShowModal(false)} showModal={showModal} />
                <DataTable<User>
                    loading={loading}
                    exportFileName={'User'}
                    onView={(item) => console.log(item)}
                    onMultiDelete={(items => console.log(items))}
                    data={users}
                    autoSizeColumns={['username', 'birthday', 'email', 'roles', 'avatar']}
                    header={(<h1><strong>User</strong> Table</h1>)}
                    onCreate={() => setShowModal(true)}
                    onReload={(callback) => { refetch(); if (callback) { callback(); } }}
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
                            tooltipValueGetter: (params) => params.value,
                        }, {
                            headerName: 'Roles', field: 'roles',
                        }, {
                            headerName: 'Birthday', field: 'birthday',
                            cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? moment(params.value).format('DD/MM/YYYY') : ''
                        }, {
                            headerName: 'Address', field: 'address', minWidth: 100,
                            tooltipField: 'address',
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
