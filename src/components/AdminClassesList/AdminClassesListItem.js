import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import siteSettingsContext from "../../context/siteSettingsContext";
import {removeClass} from "../../redux/actions/classesActions";
import {connect} from "react-redux";

const Confirm = React.lazy(() => import('../../components/UI/Confirm/Confirm'));

function AdminClassesListItem({item, removeClass}) {
    const { translate, lang } = useContext(siteSettingsContext);
    const [ showConfirmRemove, setShowConfirmRemove ] = useState(false);

    return (
        <div className="adminClasses__list-item grid_col col-6 tablet-col-4 desktop-col-3">
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
                <span className="adminClasses__list-item-remove" onClick={e => handleRemoveClass(e)}>
                    <i className="fa fa-trash-alt"/>
                </span>
            </Link>
            {
                showConfirmRemove ?
                    <Confirm message={translate('sure_to_remove_class')} confirmAction={onConfirmRemove} cancelAction={() => setShowConfirmRemove(false)}/>
                    :
                    null
            }
        </div>
    );

    function handleRemoveClass(e) {
        e.preventDefault();

        setShowConfirmRemove(true);
    }

    function onConfirmRemove() {
        setShowConfirmRemove(false);
        removeClass(item.id);
    }
}

const mapDispatchToProps = dispatch => ({
    removeClass: classID => dispatch(removeClass(classID))
});
export default connect(null, mapDispatchToProps)(AdminClassesListItem);
