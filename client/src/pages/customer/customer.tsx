import moment from 'moment';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { DataTable } from '../../components/dataTable';
import Scaffold from '../../components/scaffold';
import { Address } from '../../models/address';
import { Customer } from '../../models/customer';
import { Repository } from '../../repository';
import { CustomerService } from '../../service/customer.service';
import { CustomerForm } from './customerForm';

export function CustomerPage() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [edited, setEdited] = useState<Customer>();

    const loadData = () => {
        setLoading(true);
        CustomerService.getAllCustomers(Repository.token).then((data) => {
            setCustomers(data);
            setLoading(false);
        })
            .catch(e => {
                enqueueSnackbar(e.toString(), { variant: 'error' });
                setLoading(false);
            });
    };

    useEffect(loadData, []);

    return <Scaffold title={'Customer manager'} subTitle={'Add, edit or delete customer'} icon={'crown'}>
        <div className='row'>
            <div className='col-md-12'>
                <CustomerForm
                    visible={showCreateModal}
                    onCancel={() => setShowCreateModal(false)}
                    onCreate={() => loadData()}
                    customer={edited}
                />
                <DataTable<Customer>
                    loading={loading}
                    exportFileName={'Customer'}
                    onMultiDelete={(async (items) => {
                        try {
                            enqueueSnackbar(await CustomerService
                                .deleteCustomers(Repository.token, items.map(e => e.username)),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    })}
                    onEdit={async (user) => {
                        setLoading(true);
                        CustomerService.getCustomer(Repository.token, user.username)
                            .then(async (data) => {
                                setEdited(data);
                                setShowCreateModal(true);
                                setLoading(false);
                            })
                            .catch((e) => {
                                setLoading(false);
                                enqueueSnackbar(e.toString(), { variant: 'error' });
                            });
                    }}
                    onDelete={async (user) => {
                        try {
                            enqueueSnackbar(await CustomerService
                                .deleteCustomer(Repository.token, user.username),
                                { variant: 'success' });
                            loadData();
                        } catch (e) {
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        }
                    }}
                    data={customers}
                    autoSizeColumns={['username', 'birthday', 'email', 'avatar', 'phoneNumber']}
                    header={(<h1><strong>User</strong> Table</h1>)}
                    onCreate={() => {
                        setShowCreateModal(true);
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
                            headerName: 'Username', field: 'username',
                            cellClass: 'grid-cell-center', checkboxSelection: true,
                            headerCheckboxSelection: true,
                            headerCheckboxSelectionFilteredOnly: true
                        }, {
                            headerName: 'Email', field: 'email', minWidth: 200
                        }, {
                            headerName: 'Avatar', field: 'avatar', sortable: false, filter: false,
                            cellClass: 'grid-cell-center', suppressAutoSize: true,
                            cellRenderer: 'AgImage', tooltipComponent: 'AgImageTooltip',
                            tooltipValueGetter: (params) => params.value
                        },  {
                            headerName: 'Birthday', field: 'birthday',
                            cellClass: 'grid-cell-center',
                            cellRenderer: (params) => params.value ? moment(params.value).format('DD/MM/YYYY') : ''
                        }, {
                            headerName: 'Phone number', field: 'phoneNumber', minWidth: 150
                        }, {
                            headerName: 'Address', field: 'addresses', minWidth: 150,
                            cellRenderer: (params) => params.value ? params.value.map((e: Address) => e.address).join(', ') : ''
                        }
                    ]}
                />
            </div>
        </div>
    </Scaffold>;
}
