import React from 'react';
import Form from "../Form/Form";

export default function FiltersFilterBy({filterBy, filterChanged}) {
    return (
        <Form fields={filterBy} setFieldValue={filterChanged} />
    )
}