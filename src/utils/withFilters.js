import React, { useState, useContext, useEffect } from 'react';
import siteSettingsContext from "../context/siteSettingsContext";
import Filters from "../components/Filters/Filters";

const withFilters = (WrappedComponent, sortByOptions, filterByOptions) => {
    return (props) => {
        const { translate } = useContext(siteSettingsContext);
        const [ searchQuery, setSearchQuery ] = useState('');
        const [ showPerPage, setShowPerPage ] = useState(10);
        const [ sortBy, setSortBy ] = useState({
            type: 'radio',
            name: 'sort_by',
            id: 'sortBy',
            placeholder: translate('sort_by')
        });
        const [ filterBy, setFilterBy ] = useState(JSON.stringify([]));

        useEffect(() => {
            if ( !sortBy.options && sortByOptions ) {
                const options = [];

                sortByOptions.forEach(opt => {
                    options.push({
                        name: opt.title,
                        icon: opt.icon
                    });
                });

                setSortBy({
                    ...sortBy,
                    value: sortByOptions[0].title,
                    options: options
                });
            }

            if ( !JSON.parse(filterBy).length && filterByOptions ) {
                const newFilters = [];

                filterByOptions.forEach(item => {
                    newFilters.push({
                        type: 'select',
                        hasReset: true,
                        id: item.id,
                        value: '',
                        placeholder: item.placeholder,
                        options: item.options.map(opt => {
                            return {
                                title: translate(opt),
                                id: opt
                            }
                        })
                    });
                });
                setFilterBy(JSON.stringify(newFilters));
            }
        }, [filterBy, sortBy, translate]);

        return <WrappedComponent {...props} filterChanged={filterChanged} searchQuery={searchQuery} showPerPage={showPerPage} sortBy={sortBy} filterBy={JSON.parse(filterBy)} filters={_renderFilters()} />;

        function filterChanged(type, value) {
            if ( type === 'searchQuery' ) {
                setSearchQuery(value);
            }
            if ( type === 'showPerPage' ) {
                setShowPerPage(value);
            }

            if ( type === 'searchQuery' ) {
                setSearchQuery(value);
            }
            if ( type === 'showPerPage' ) {
                setShowPerPage(value);
            }
            if ( type === 'sortBy' ) {
                setSortBy({
                    ...sortBy,
                    value: value
                });
            }
            if ( type.includes('filterBy') ) {
                const newFilters = JSON.parse(filterBy);
                newFilters.find(filter => filter.id === type).value = value;

                setFilterBy(JSON.stringify(newFilters));
            }
        }

        function _renderFilters() {
            return <Filters showPerPage={showPerPage} searchQuery={searchQuery} sortBy={sortBy.options ? sortBy : undefined} filterBy={JSON.parse(filterBy).length ? JSON.parse(filterBy) : undefined} filterChanged={filterChanged} />
        }
    }
};

export default withFilters;
