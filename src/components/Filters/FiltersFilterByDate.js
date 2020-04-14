import React from 'react';
import Form from "../Form/Form";

export default function FiltersFilterByDate({filterByDate, filterChanged}) {
    return (
        <Form fields={filterByDate} setFieldValue={filterChanged} />
    );
}