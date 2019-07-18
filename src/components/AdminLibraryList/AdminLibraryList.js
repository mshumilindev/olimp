import React, { useContext } from 'react';
import {Preloader} from "../UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";
import AdminLibaryListItem from './AdminLibraryListItem';

export default function AdminLibraryList({loading, setTags, onDeleteDoc, list}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="table__holder">
            <table className="table">
                <colgroup>
                    <col width="300"/>
                    <col width="300"/>
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
                    <th className="table__head-cell"/>
                </tr>
                </thead>
                <tbody>
                {
                    list.map(item => {
                        return (
                            <AdminLibaryListItem key={item.id} item={item} setTags={setTags} onDeleteDoc={onDeleteDoc} loading={loading} />
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
    );
}
