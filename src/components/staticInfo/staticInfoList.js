import React from 'react';
import {Preloader} from "../UI/preloader";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import SiteSettingsContext from "../../context/siteSettingsContext";
import './staticInfoList.scss';

export default class StaticInfoList extends React.Component {
    render() {
        const { staticInfoList, loading } = this.props;

        return (
            <div className="staticInfoList">
                {
                    loading ?
                        <Preloader size={50}/>
                        :
                        staticInfoList.map(item => this._renderItem(item))
                }
            </div>
        )
    }

    _renderItem(item) {
        const { lang } = this.context;

        return (
            <div key={item.id} className="staticInfoList_item">
                <Link to={'/pages/' + item.slug}>{ item.name[lang] ? item.name[lang] : item.name['ua'] }</Link>
            </div>
        )
    }
}

StaticInfoList.contextType = SiteSettingsContext;


StaticInfoList.propTypes = {
    staticInfoList: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired
};
