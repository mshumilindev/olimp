import React, { useContext } from 'react';
import './adminClassesList.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../UI/preloader";
import AdminClassesListItem from './AdminClassesListItem';

function AdminClassesList({list, loading}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            {
                list && list.length ?
                    <div className="adminClasses__list grid">
                        {
                            list.map(item => <AdminClassesListItem item={item} key={item.id} />)
                        }
                    </div>
                    :
                    loading ?
                        <Preloader/>
                        :
                        null
            }
        </div>
    );
}
export default AdminClassesList;