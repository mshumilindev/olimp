import React, { useContext } from 'react';
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import AdminLibaryListItem from './AdminLibraryListItem';
import withFilters from "../../utils/withFilters";
import withPager from "../../utils/withPager";
import withTags from "../../utils/withTags";

function AdminLibraryList({loading, setTags, onDeleteDoc, list, users, filters, searchQuery, pager, selectedTags, onUploadFile}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <>
            <div className="section__title-holder">
                <h2 className="section__title">
                    <i className="content_title-icon fa fa-bookmark" />
                    { translate('library') }
                </h2>
                <div className="section__title-actions">
                    <a href="/" className="btn btn_primary" onClick={e => onUploadFile(e)}>
                        <i className="content_title-icon fa fa-cloud-upload-alt" />
                        { translate('upload') }
                    </a>
                </div>
                {
                    loading ?
                        <Preloader size={60}/>
                        :
                        null
                }
            </div>
            { filters }
            <div className="adminLibrary__list widget">
                {
                    list ?
                        list.length ?
                            <>
                                { selectedTags }
                                <div className="table__holder">
                                    <table className="table">
                                        <colgroup>
                                            <col width="200"/>
                                            <col width="200"/>
                                            <col width="200"/>
                                            <col width="150"/>
                                        </colgroup>
                                        <thead>
                                        <tr className="table__head-row">
                                            <th className="table__head-cell">
                                                { translate('doc') }
                                            </th>
                                            <th className="table__head-cell">
                                                { translate('tags') }
                                            </th>
                                            <th className="table__head-cell">
                                                { translate('teacher') }
                                            </th>
                                            <th className="table__head-cell"/>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            filterList().map(item => {
                                                return (
                                                    <AdminLibaryListItem key={item.id} item={item} setTags={setTags} onDeleteDoc={onDeleteDoc} loading={loading} users={users} />
                                                )
                                            })
                                        }
                                        </tbody>
                                    </table>
                                    {
                                        loading ?
                                            <Preloader/>
                                            :
                                            null
                                    }
                                </div>
                                { pager }
                            </>
                            :
                            <div className="nothingFound">
                                <a href="/" className="btn btn_primary" onClick={e => onUploadFile(e)}>
                                    <i className="content_title-icon fa fa-cloud-upload-alt" />
                                    { translate('upload') }
                                </a>
                            </div>
                        :
                        <Preloader/>
                }
            </div>
        </>
    );

    function filterList() {
        return list.filter(item => searchQuery.trim().length ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);
    }
}
export default withFilters(withPager(withTags(AdminLibraryList)), true, true);