import React from 'react';

const AdminUsersList = React.lazy(() => import('../../components/AdminUsersList/AdminUsersList'));

export default function AdminUsers() {
    return (
        <AdminUsersList/>
    );
}
