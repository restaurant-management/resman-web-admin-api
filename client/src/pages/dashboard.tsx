import { Button, Icon, Input } from 'antd';
import React, { Component } from 'react';
import Highlighter from 'react-highlight-words';
import { AntDataTable } from '../components/antDataTable';
import Scaffold from '../components/scaffold';

export default class DashBoard extends Component<any, any> {

    public data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        },
        {
            key: '2',
            name: 'Joe Black',
            age: 42,
            address: 'London No. 1 Lake Park',
        },
        {
            key: '3',
            name: 'Jim Green',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        },
        {
            key: '4',
            name: 'Jim Red',
            age: 32,
            address: 'London No. 2 Lake Park',
        },
    ];

    private searchInput: any;

    constructor(props: any) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    public handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
        confirm();
        this.setState({
            searchText: selectedKeys[0],
            searchedColumn: dataIndex,
        });
    }

    public handleReset = (clearFilters: any) => {
        clearFilters();
        this.setState({ searchText: '' });
    }

    public getColumnSearchProps = (dataIndex: any) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={node => {
                        this.searchInput = node;
                    }}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Button
                    type='primary'
                    onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                    icon='search'
                    size='small'
                    style={{ width: 90, marginRight: 8 }}
                >
                    {'Search'}
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size='small' style={{ width: 90 }}>
                    {'Reset'}
                </Button>
            </div>
        ),
        filterIcon: (filtered: any) => (
            <Icon type='search' style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value: any, record: any) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: (visible: any) => {
            if (visible) {
                setTimeout(() => this.searchInput.select());
            }
        },
        render: (text: any) =>
            this.state.searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[this.state.searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (text),
    })

    public render() {
        const columns = [
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '30%',
                sorter: true,
                ...this.getColumnSearchProps('name'),
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age',
                width: '20%',
                sorter: true,
                ...this.getColumnSearchProps('age'),
            },
            {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                sorter: true,
                ...this.getColumnSearchProps('address'),
            },
        ];

        return <Scaffold title={'User manager'} subTitle={'Add, edit or delete user'}>
            <div className='row'>
                <div className='col-md-12'>
                    <AntDataTable data={this.data} columnDefs={columns} />
                </div>
            </div>
        </Scaffold>;
    }
}
