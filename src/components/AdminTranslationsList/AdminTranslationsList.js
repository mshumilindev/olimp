import React from 'react';
import siteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../UI/preloader";
import AdminTranslationsListItem from './AdminTranslationsListItem';
import './adminTranslationsList.scss';
import withPager from "../../utils/withPager";

class AdminTranslationsList extends React.Component {
    constructor(props) {
        super();

        this.state = {
            isLoaded: props.isLoaded
        };
        this.cols = [
            {
                id: 'key',
                name: '',
                width: 200
            },
            {
                id: 'en',
                name: 'en',
                width: 200
            },
            {
                id: 'ru',
                name: 'ru',
                width: 200
            },
            {
                id: 'ua',
                name: 'ua',
                width: 200
            }
        ];
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.notEqual(this.props, nextProps);
    }

    render() {
        const { list, searchQuery } = this.props;
        const { translate } = this.context;

        return (
            <div className="adminTranslations__list widget">
                {
                    list && list.length ?
                        <div className="table__holder">
                            <table className="adminTranslations__table table">
                                <colgroup>
                                    { this.cols.map(col => <col width={col.width} key={col.id}/>) }
                                </colgroup>
                                <thead>
                                    <tr className="table__head-row">
                                        { this.cols.map(col => <th className="table__head-cell" key={col.id}>{ translate(col.name) }</th>) }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        list.map((item, index) => {
                                            return (
                                                <tr className="table__body-row" key={item.id + index}>
                                                    <td className="table__body-cell">
                                                        <span className="table__key">{ item.id }</span>
                                                    </td>
                                                    {
                                                        item.langs.map(lang => {
                                                            return (
                                                                <td className="table__body-cell" key={Object.keys(lang)[0]}>
                                                                    <AdminTranslationsListItem lang={Object.keys(lang)[0]} item={lang[Object.keys(lang)[0]]} itemKey={item.id} />
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                            { this.props.pager }
                            {
                                this.props.loading ?
                                    <Preloader/>
                                    :
                                    null
                            }
                        </div>
                        :
                        !searchQuery ?
                            <Preloader/>
                            :
                            <div className="nothingFound">
                                { translate('nothing_found') }
                            </div>
                }
            </div>
        );
    }

    notEqual(current, next) {
        const { isLoaded } = this.props;

        if ( isLoaded ) {
            if ( JSON.stringify(current.list) === JSON.stringify(next.list) && current.pager === next.pager ) {
                return false;
            }
        }
        if ( typeof current.list === "undefined" ) {
            return true;
        }
        else {
            if ( !isLoaded ) {
                this.props.setIsLoaded(true);
            }
        }
        return true;
    }
}
AdminTranslationsList.contextType = siteSettingsContext;
export default withPager(AdminTranslationsList);