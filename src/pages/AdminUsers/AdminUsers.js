import React, {useCallback} from 'react';
import {connect} from "react-redux";
import withFilters from "../../utils/withFilters";
import AdminUsersList from '../../components/AdminUsersList/AdminUsersList';

const sortByOptions = [
    {
        title: 'name',
        icon: 'fas fa-sort-alpha-up'
    },
    {
        title: 'role',
        icon: 'fas fa-user-tag'
    },
    {
        title: 'class',
        icon: 'fas fa-graduation-cap'
    }
];

const filterByOptions = [
    {
        id: 'filterByRole',
        options: ['admin', 'teacher', 'student', 'guest'],
        placeholder: 'role'
    },
    {
        id: 'filterByStatus',
        options: ['active', 'suspended'],
        placeholder: 'status',
    }
];

function AdminUsers({usersList, searchQuery, sortBy, showPerPage, filterBy, filters, loading}) {
    const filterUsersList = useCallback(() => {
        return usersList && filterBy.length ? usersList
                .filter(user => {
                    const returnValues = [];
                    const filterByRole = filterBy.find(filter => filter.id === 'filterByRole');
                    const filterByStatus = filterBy.find(filter => filter.id === 'filterByStatus');

                    filterByRole.value ?
                        user.role === filterByRole.value ?
                            returnValues.push(true)
                            :
                            returnValues.push(false)
                        :
                        returnValues.push(true);

                    filterByStatus.value ?
                        user.status === filterByStatus.value ?
                            returnValues.push(true)
                            :
                            returnValues.push(false)
                        :
                        returnValues.push(true);

                    return returnValues.every(value => value);
                })
                .filter(user => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .sort((a, b) => {
                    if ( a.name < b.name ) {
                        return -1;
                    }
                    if ( a.name > b.name ) {
                        return 1;
                    }
                    return 0;
                })
                .sort((a, b) => {
                    const aValue = a[sortBy.value] === 'admin' ? 'a' : a[sortBy.value] === 'teacher' ? 'b' : a[sortBy.value] === 'student' ? 'c' : a[sortBy.value];
                    const bValue = b[sortBy.value] === 'admin' ? 'a' : b[sortBy.value] === 'teacher' ? 'b' : b[sortBy.value] === 'student' ? 'c' : b[sortBy.value];

                    if ( a[sortBy.value] === undefined ) {
                        return 1;
                    }
                    if ( b[sortBy.value] === undefined ) {
                        return -1;
                    }
                    if ( aValue < bValue ) {
                        return -1;
                    }
                    if ( aValue > bValue ) {
                        return 1;
                    }
                    return 0;
                })
            :
            usersList;
    }, [filterBy, searchQuery, sortBy, usersList]);

    return <AdminUsersList showPerPage={showPerPage} list={filterUsersList()} searchQuery={searchQuery} sortBy={sortBy} filterBy={filterBy} filters={filters} loading={loading} />;
}
const mapStateToProps = state => ({
    usersList: state.usersReducer.usersList,
    loading: state.usersReducer.loading
});
export default connect(mapStateToProps)(withFilters(AdminUsers, true, true, sortByOptions, filterByOptions));