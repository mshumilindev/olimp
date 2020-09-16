import React, {useContext} from 'react';
import UserPicker from "../../components/UI/UserPicker/UserPicker";
import Preloader from "../../components/UI/preloader";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function AdminClassCurator({loading, classData, canEdit, setCurator}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="widget">
            <div className="widget__title">
                <i className="content_title-icon fa fa-user"/>
                { translate('curator') }
            </div>
            {
                classData ?
                    <UserPicker noneditable={!canEdit} placeholder={translate('pick_curator')} type={'teacher'} selectedList={classData.curator ? [classData.curator] : []} addUsers={setCurator} />
                    :
                    loading ?
                        <Preloader/>
                        :
                        null
            }
        </div>
    );
}