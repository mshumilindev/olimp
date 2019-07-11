import React from 'react';
import Filters from '../../components/Filters/Filters';
import siteSettingsContext from "../../context/siteSettingsContext";

const AdminUsersList = React.lazy(() => import('../../components/AdminUsersList/AdminUsersList'));

export default class AdminUsers extends React.Component {
    constructor(props, context) {
        super();

        const { translate } = context;

        this.state = {
            searchQuery: '',
            sortBy: {
                type: 'radio',
                name: 'sort_by',
                id: 'sortBy',
                value: 'name',
                placeholder: translate('sort_by'),
                options: [
                    {
                        'name': 'name',
                        'icon': 'fas fa-sort-alpha-up'
                    },
                    {
                        'name': 'role',
                        'icon': 'fas fa-user-tag'
                    },
                    {
                        'name': 'class',
                        'icon': 'fas fa-graduation-cap'
                    }
                ]
            },
            filterBy: [
                {
                    type: 'select',
                    id: 'filterByRole',
                    hasReset: true,
                    options: [
                        {
                            title: translate('admin'),
                            id: 'admin'
                        }, {
                            title: translate('teacher'),
                            id: 'teacher'
                        }, {
                            title: translate('student'),
                            id: 'student'
                        }
                    ],
                    placeholder: translate('role'),
                    value: ''
                },
                {
                    type: 'select',
                    id: 'filterByStatus',
                    hasReset: true,
                    options: [
                        {
                            title: translate('active'),
                            id: 'active'
                        },
                        {
                            title: translate('suspended'),
                            id: 'suspended'
                        }
                    ],
                    placeholder: translate('status'),
                    value: ''
                }
            ]
        };

        this.filterChanged = this.filterChanged.bind(this);
    }

    render() {
        const { searchQuery, sortBy, filterBy } = this.state;

        return (
            <AdminUsersList searchQuery={searchQuery} sortBy={sortBy} filterBy={filterBy} filters={this._renderFilters()} />
        );
    }

    _renderFilters() {
        const { searchQuery, sortBy, filterBy } = this.state;

        return <Filters searchQuery={searchQuery} sortBy={sortBy} filterBy={filterBy} filterChanged={this.filterChanged} />;
    }

    filterChanged(type, value) {
        if ( type === 'searchQuery' ) {
            this.setState({
                searchQuery: value
            });
        }
        else if ( type === 'sortBy' ) {
            this.setState(state => {
                return {
                    sortBy: {
                        ...state.sortBy,
                        value: value
                    }
                }
            });
        }
        else {
            this.state.filterBy.find(filter => filter.id === type).value = value;
            this.setState(state => {
                return {
                    filterBy: state.filterBy
                }
            });
        }
    }
}
AdminUsers.contextType = siteSettingsContext;