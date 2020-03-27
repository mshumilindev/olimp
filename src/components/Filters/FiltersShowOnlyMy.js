import React, {useContext} from 'react';
import Form from "../Form/Form";
import SiteSettingsContext from "../../context/siteSettingsContext";
import userContext from "../../context/userContext";

export default function FiltersShowOnlyMy({showOnlyMyChecked, filterChanged}) {
    const { translate } = useContext(SiteSettingsContext);
    const { user } = useContext(userContext);

    const showOnlyMyFields = [
        {
            type: 'checkbox',
            label: translate('show_only_my'),
            checked: showOnlyMyChecked,
            value: true,
            id: 'showOnlyMy'
        }
    ];

    return (
        user.role !== 'admin' ?
            <Form fields={showOnlyMyFields} setFieldValue={filterChanged} />
            :
            null
    )
}