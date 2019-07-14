import React from 'react';
import './tagsList.scss';

export default function TagsList({tagsList}) {
    return (
        <div className="tagsList">
            {
                tagsList && tagsList.length ?
                    tagsList.map(tag => <span className="tagsList__item" key={tag}>{ tag }</span>)
                    :
                    null
            }
        </div>
    )
}