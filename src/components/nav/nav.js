import React  from 'react';
import './nav.scss';
import { Link } from 'react-router-dom';
import logo from "../../assets/img/logo.png";
import SiteSettingsContext from "../../context/siteSettingsContext";
import classNames from 'classnames';

export default class Nav extends React.Component {
    render() {
        const { nav, prefix, showLogo } = this.props;
        const { siteName } = this.context;

        return (
            <nav className={prefix + 'nav'}>
                <ul className={prefix + 'nav_list'}>
                    {
                        showLogo ?
                            <li className={prefix + 'nav_logo-item'}>
                                <img src={ logo } alt={ siteName } className={prefix + 'nav_logo'} />
                            </li>
                            :
                            null
                    }
                    { nav.map(item => this._renderItem(item)) }
                </ul>
            </nav>
        )
    }

    _renderItem(item) {
        const { prefix, hideItems } = this.props;
        const pathName = window.location.pathname;
        const { translate } = this.context;

        if ( !hideItems || !hideItems.some(hiddenItem => item.name === hiddenItem) ) {
            return (
                <li key={item.id} className={prefix + 'nav_item'}>
                    <Link to={ item.url } className={classNames(prefix + 'nav_link type-' + item.name, {'active': item.url === pathName})}>
                        <i className={prefix + 'nav_icon ' + item.icon} />
                        <span className={prefix + 'nav_text'}>{ translate(item.name) }</span>
                    </Link>
                </li>
            )
        }
        return false;
    }
}

Nav.contextType = SiteSettingsContext;