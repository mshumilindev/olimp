import React, {useContext} from 'react';
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function FiltersShowPerPage({showPerPage, filterChanged}) {
    const { translate } = useContext(siteSettingsContext);

    const showPerPageField = [
        {
            type: 'select',
            name: 'showPerPage',
            id: 'showPerPage',
            value: showPerPage,
            placeholder: translate('show_per_page'),
            options: [
                {
                    title: 10,
                    id: 10
                },
                {
                    title: 20,
                    id: 20
                },
                {
                    title: 50,
                    id: 50
                }
            ]
        }
    ];

    return (
        <>
            <Form fields={showPerPageField} setFieldValue={filterChanged} />
        </>
    )
}