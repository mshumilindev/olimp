import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import siteSettingsContext from "../../context/siteSettingsContext";

function AdminClassesListItem({item}) {
    const { translate, lang } = useContext(siteSettingsContext);

    console.log(item);

    return (
        <div className="adminClasses__list-item grid_col col-3">
            <Link to={'/admin-classes/' + item.id} className="adminClasses__list-link">
                <h2 className="adminClasses__list-item-title">
                    {
                        item.title[lang] ? item.title[lang] : item.title['ua']
                    }
                </h2>
                <div className="adminClasses__list-item-info">
                    <div className="adminClasses__list-item-info-inner">
                        {
                            item.info[lang] ? item.info[lang] : item.info['ua'] ? item.info['ua'] : translate('no_description')
                        }
                    </div>
                </div>
                <span href="/" className="adminClasses__list-item-remove" onClick={e => removeClass(e)}>
                    <i className="fa fa-trash-alt"/>
                </span>
            </Link>
        </div>
    );

    function removeClass(e) {
        e.preventDefault();

        console.log('remove class');
    }
}

export default AdminClassesListItem;