import React, { useContext } from 'react';
import './filters.scss';
import siteSettingsContext from "../../context/siteSettingsContext";

const FiltersSearchQuery = React.lazy(() => import('./FiltersSearchQuery'));
const FiltersSortBy = React.lazy(() => import('./FiltersSortBy'));
const FiltersFilterBy = React.lazy(() => import('./FiltersFilterBy'));

export default function Filters({searchQuery, sortBy, filterBy, filterChanged}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="filters">
            <div className="filters__body">
                <h2 className="filters__heading">{ translate('filters') }</h2>
                <div className="filters__inner">
                    {
                        typeof searchQuery !== 'undefined' ?
                            <FiltersSearchQuery searchQuery={searchQuery} filterChanged={filterChanged}/>
                            :
                            null
                    }
                    {
                        typeof filterBy !== 'undefined' ?
                            <FiltersFilterBy filterBy={filterBy} filterChanged={filterChanged}/>
                            :
                            null
                    }
                    {
                        typeof sortBy !== 'undefined' ?
                            <FiltersSortBy sortBy={sortBy} filterChanged={filterChanged}/>
                            :
                            null
                    }
                </div>
            </div>
        </div>
    );
}