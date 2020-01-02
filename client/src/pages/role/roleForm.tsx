import { Form, Input, Modal, Select } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import OverlayIndicator from '../../components/overlayIndicator';
import { Permission } from '../../models/permission';
import { Role } from '../../models/role';
import { Repository } from '../../repository';
import { RoleService } from '../../service/role.service';

const { Option, OptGroup } = Select;

interface Props extends FormComponentProps {
    visible: boolean;
    role?: Role;
    onCancel: any;
    onCreate?: any;
}

const roleForm = Form.create<Props>({ name: 'RoleForm' })(
    (props: Props) => {
        const { visible, onCancel, onCreate, role } = props;
        const { getFieldDecorator } = props.form;

        const [loading, setLoading] = useState(false);
        const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
        const { enqueueSnackbar } = useSnackbar();

        const handleSubmit = () => {
            props.form.validateFieldsAndScroll((err, values) => {
                if (!err) {
                    setLoading(true);
                    if (!role) {
                        RoleService.create(Repository.token, {
                            name: values.name,
                            slug: values.slug,
                            description: values.description,
                            level: values.level,
                            permissions: values.permissions
                        }).then(() => {
                            enqueueSnackbar('Create Role success', { variant: 'success' });
                            setLoading(false);
                            props.form.resetFields();
                            onCancel();
                            if (onCreate) {
                                onCreate();
                            }
                        }).catch((e: any) => {
                            setLoading(false);
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        });
                    } else {
                        RoleService.edit(Repository.token, {
                            name: values.name,
                            slug: role.slug,
                            description: values.description,
                            level: values.level,
                            permissions: values.permissions
                        }).then(() => {
                            enqueueSnackbar('Edit Role success', { variant: 'success' });
                            setLoading(false);
                            props.form.resetFields();
                            if (onCancel) {
                                onCancel();
                            }
                            if (onCreate) {
                                onCreate();
                            }
                        }).catch(e => {
                            setLoading(false);
                            console.log(e);
                            enqueueSnackbar(e.toString(), { variant: 'error' });
                        });
                    }
                }
            });
        };

        return (
            <Modal
                visible={visible}
                title={<h3 className='modal-title'>
                    {role ? 'Edit' : 'Create'} <strong>Role</strong>
                </h3>}
                okText={role ? 'Save' : 'Create'}
                onCancel={onCancel}
                destroyOnClose
                onOk={() => {
                    handleSubmit();
                }}
            >
                <OverlayIndicator show={loading} />
                <Form>
                    <Form.Item label='Name' hasFeedback>
                        {getFieldDecorator('name', {
                            initialValue: role ? role.name : '',
                            rules: [{ required: true, message: 'Please input name!' }]
                        })(
                            <Input placeholder='Name' />
                        )}
                    </Form.Item>
                    <Form.Item label='Slug' hasFeedback>
                        {getFieldDecorator('slug', {
                            initialValue: role ? role.slug : ''
                        })(
                            <Input placeholder='Name' disabled={!!role} />
                        )}
                    </Form.Item>
                    <Form.Item label='Description' hasFeedback>
                        {getFieldDecorator('description', {
                            initialValue: role ? role.description : ''
                        })(<Input type='textarea' />)}
                    </Form.Item>
                    <Form.Item label='Permissions' hasFeedback>
                        {getFieldDecorator('permissions', {
                            initialValue: role ? role.permissions : undefined
                        })(
                            <Select mode='multiple' placeholder='Roles'>
                                {
                                    Object.entries(Permission).map(([key, value]) => {
                                        return (
                                            <OptGroup label={key} key={key}>
                                                {value.toArray()
                                                    .map((e: any) =>
                                                        <Option key={e} value={e}>{e}</Option>)}
                                            </OptGroup>
                                        );
                                    })
                                }
                            </Select>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        );
    }
);

export { roleForm as RoleForm };
