import React, { useContext } from 'react';
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import AdminLibaryListItem from './AdminLibraryListItem';
import withPager from "../../utils/withPager";
import withData from "../../utils/withData";

function AdminLibraryList({loading, setTags, onDeleteDoc, list, users, pager, selectedTags, onUploadFile, totalItems}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="adminLibrary__list widget">
            {
                list ?
                    list.length ?
                        <>
                            <div className="section__data">
                                { selectedTags }
                                { totalItems }
                            </div>
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
                                            { translate('teachers') }
                                        </th>
                                        <th className="table__head-cell"/>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        list.map(item => {
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
    );
}
export default withData(withPager(AdminLibraryList));