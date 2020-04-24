import React, { useState, useContext, useEffect } from 'react';
import siteSettingsContext from "../context/siteSettingsContext";
import Filters from "../components/Filters/Filters";
import moment from "moment";

const withFilters = (WrappedComponent, hasSearch, hasShowPerPage, sortByOptions, filterByOptions, showOnlyMy, selectClass, filterByDate) => {
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
        const [ filterByDateFields, setFilterByDateFields ] = useState([
            {
                type: 'datepicker',
                id: 'datepickerStart',
                value: moment().subtract(7,'d').unix(),
                label: translate('from')
            }
        ]);
        const [ filterBy, setFilterBy ] = useState(JSON.stringify([]));
        const [ showOnlyMyChecked, setShowOnlyMyChecked ] = useState(!!showOnlyMy);
        const [ selectedClass, setSelectedClass ] = useState(null);

        useEffect(() => {
            if ( !sortBy.options && sortByOptions ) {
                const options = [];

                sortByOptions.forEach(opt => {
                    options.push({
                        name: opt.title,
                        icon: opt.icon,
                        id: opt.title
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

        return <WrappedComponent {...props} filterChanged={filterChanged} searchQuery={searchQuery} showPerPage={showPerPage} sortBy={sortBy} filterBy={JSON.parse(filterBy)} filters={_renderFilters()} showOnlyMy={!!showOnlyMy && showOnlyMyChecked ? showOnlyMy : null} selectedClass={selectedClass} setSelectedClass={setSelectedClass} filterByDate={{start: filterByDateFields[0].value, end: moment(filterByDateFields[0].value * 1000).add(6, 'd').unix()}} />;

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
            if ( type === 'showOnlyMy' ) {
                setShowOnlyMyChecked(!showOnlyMyChecked);
            }
            if ( type === 'selectedClass' ) {
                setSelectedClass(value);
            }
            if ( type === 'datepickerStart' ) {
                const newFields = filterByDateFields;

                newFields.find(item => item.id === 'datepickerStart').value = value;
                setFilterByDateFields(Object.assign([], newFields));
            }
        }

        function _renderFilters() {
            return <Filters
                showPerPage={hasShowPerPage ? showPerPage : undefined}
                searchQuery={hasSearch ? searchQuery : undefined}
                sortBy={sortBy.options ? sortBy : undefined}
                filterBy={JSON.parse(filterBy).length ? JSON.parse(filterBy) : undefined}
                showOnlyMyChecked={showOnlyMyChecked ? showOnlyMyChecked : undefined}
                showOnlyMy={showOnlyMy ? showOnlyMy : undefined}
                filterChanged={filterChanged}
                selectedClass={selectClass ? selectedClass : undefined}
                filterByDate={filterByDate ? filterByDateFields : undefined}
            />
        }
    }
};

export default withFilters;
