import React, { useState, useContext, useEffect } from 'react';
import Form from "../Form/Form";
import siteSettingsContext from "../../context/siteSettingsContext";

export default function FiltersSearchQuery({searchQuery, filterChanged}) {
    const { translate } = useContext(siteSettingsContext);

    const [ formFields, setFormFields ] = useState([{
        type: 'text',
        value: searchQuery,
        id: 'searchQuery',
        placeholder: translate('search')
    }]);

    useEffect(() => {
        if ( formFields[0].value !== searchQuery ) {
            setFormFields([{
                ...formFields[0],
                value: searchQuery
            }]);
        }
    }, [formFields, searchQuery]);

    return (
        <Form fields={formFields} setFieldValue={filterChanged} />
    );
}