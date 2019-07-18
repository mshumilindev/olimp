import React from 'react';
import { Link } from 'react-router-dom';
import './breadcrumbs.scss';

export default function Breadcrumbs({list}) {
    return (
        <div className="breadcrumbs">
            { list.map((item, index, array) => _renderItem(item, index === array.length - 1)) }
        </div>
    );

    function _renderItem(item, isLast) {
        return (
            <div className="breadcrumbs__item" key={item.name}>
                {
                    isLast ?
                        <span className="breadcrumbs__noLink">{ item.name }</span>
                        :
                        <Link to={item.url} className="breadcrumbs__link">{ item.name }</Link>
                }
            </div>
        )
    }
}