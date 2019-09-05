import React, { useContext } from 'react';
import './adminClassesList.scss';
import siteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../UI/preloader";

function AdminClassesList({list}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="adminClasses__list widget">
            {
                list && list.length ?
                    <>
                        This is classes
                    </>
                    :
                    <Preloader/>
            }
        </div>
    );
}
export default AdminClassesList;