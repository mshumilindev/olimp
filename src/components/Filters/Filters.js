import React, { useContext } from 'react';
import './filters.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';
import { connect } from 'react-redux';

const FiltersSearchQuery = React.lazy(() => import('./FiltersSearchQuery'));
const FiltersSortBy = React.lazy(() => import('./FiltersSortBy'));
const FiltersFilterBy = React.lazy(() => import('./FiltersFilterBy'));
const FiltersShowPerPage = React.lazy(() => import('./FiltersShowPerPage'));
const FiltersShowOnlyMy = React.lazy(() => import('./FiltersShowOnlyMy'));
const FiltersSelectClass = React.lazy(() => import('./FiltersSelectClass'));
const FiltersFilterByDate = React.lazy(() => import('./FiltersFilterByDate'));

function Filters({user, searchQuery, sortBy, filterBy, showPerPage, filterChanged, showOnlyMy, showOnlyMyChecked, selectedClass, filterByDate}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="filters">
            <div className={classNames('filters__body', { filters__single: getFiltersSingle() })}>
                <h2 className="filters__heading">{ translate('filters') }:</h2>
                <div className="filters__inner">
                    {
                        typeof searchQuery !== 'undefined' ?
                            <div className="filters__item filters__searchQuery">
                                <FiltersSearchQuery searchQuery={searchQuery} filterChanged={filterChanged}/>
                            </div>
                            :
                            null
                    }
                    {
                        typeof filterBy !== 'undefined' ?
                            <div className="filters__item filters__filterBy">
                                <FiltersFilterBy filterBy={filterBy} filterChanged={filterChanged}/>
                            </div>
                            :
                            null
                    }
                    {
                        typeof showPerPage !== 'undefined' ?
                            <div className="filters__item filters__showPerPage">
                                <FiltersShowPerPage showPerPage={showPerPage} filterChanged={filterChanged}/>
                            </div>
                            :
                            null
                    }
                    {
                        typeof sortBy !== 'undefined' ?
                            <div className="filters__item filters__sortBy">
                                <FiltersSortBy sortBy={sortBy} filterChanged={filterChanged}/>
                            </div>
                            :
                            null
                    }
                    {
                        typeof selectedClass !== 'undefined' ?
                            <div className="filters__item filters__selectClass">
                                <FiltersSelectClass selectedClass={selectedClass} filterChanged={filterChanged} />
                            </div>
                            :
                            null
                    }
                    {
                        typeof filterByDate !== 'undefined' ?
                            <div className="filters__item filters__filterByDate">
                                <FiltersFilterByDate filterByDate={filterByDate} filterChanged={filterChanged} />
                            </div>
                            :
                            null
                    }
                    {
                        typeof showOnlyMy !== 'undefined' && user.role !== 'admin' ?
                            <div className="filters__item filters__showOnlyMy">
                                <FiltersShowOnlyMy showOnlyMyChecked={showOnlyMyChecked} filterChanged={filterChanged} />
                            </div>
                            :
                            null
                    }
                </div>
            </div>
        </div>
    );

    function getFiltersSingle() {
        return [searchQuery, sortBy, filterBy].filter(item => typeof item !== 'undefined').length === 1;
    }
}

const mapStateToProps = state => {
    return {
        user: state.authReducer.currentUser
    }
};

export default connect(mapStateToProps)(Filters);