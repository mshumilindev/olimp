import React from 'react';
import Form from "../Form/Form";

export default function FiltersSortBy({sortBy, filterChanged}) {
    return (
        <Form fields={[sortBy]} setFieldValue={filterChanged} />
    )
}