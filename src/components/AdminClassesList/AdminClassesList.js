import React, { useContext } from 'react';
import './adminClassesList.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import Preloader from "../UI/preloader";
import AdminClassesListItem from './AdminClassesListItem';
import withData from "../../utils/withData";

function AdminClassesList({list, loading, searchQuery, startCreateClass, totalItems}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            { totalItems }
            {
                list && list.length ?
                    <div className="adminClasses__list grid">
                        {
                            list.map(item => <AdminClassesListItem item={item} key={item.id} />)
                        }
                    </div>
                    :
                    !loading ?
                        searchQuery ?
                            <div className="nothingFound">
                                { translate('nothing_found') }
                            </div>
                            :
                            <div className="nothingFound">
                                <a href="/" className="btn btn_primary" onClick={e => startCreateClass(e)}>
                                    <i className="content_title-icon fa fa-plus"/>
                                    { translate('create_class') }
                                </a>
                            </div>
                        :
                        null
            }
            {
                loading ?
                    <Preloader/>
                    :
                    null
            }
        </div>
    );
}
export default withData(AdminClassesList);