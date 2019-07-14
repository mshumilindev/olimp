import React, { useContext } from 'react';
import {connect} from "react-redux";
import withFilters from "../../utils/withFilters";
import { fetchLibrary } from '../../redux/actions/libraryActions';
import siteSettingsContext from "../../context/siteSettingsContext";
import {Preloader} from "../../components/UI/preloader";
import withPager from "../../utils/withPager";
import TagsList from '../../components/UI/TagsList/TagsList';

function AdminLibrary({list, filters, searchQuery, pager}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="adminLibrary">
            <div className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className="content_title-icon fa fa-bookmark" />
                        { translate('library') }
                    </h2>
                    <div className="section__title-actions">
                        <a href="/" className="btn btn_primary">
                            <i className="content_title-icon fa fa-cloud-upload-alt" />
                            { translate('upload') }
                        </a>
                    </div>
                </div>
                { filters }
                <div className="adminLibrary__list widget">
                    {
                        list ?
                            <div className="table__holder">
                                <table className="table">
                                    <colgroup>
                                        <col width="300"/>
                                        <col width="300"/>
                                        <col width="100"/>
                                    </colgroup>
                                    <thead>
                                        <tr className="table__head-row">
                                            <th className="table__head-cell">
                                                { translate('doc') }
                                            </th>
                                            <th className="table__head-cell">
                                                { translate('tags') }
                                            </th>
                                            <th className="table__head-cell"/>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filterList().map(item => {
                                                return (
                                                    <tr className="table__body-row" key={item.id}>
                                                        <td className="table__body-cell">
                                                            <div className="table__ellipsis">
                                                                <a href="/" title={item.name}>
                                                                    <i className="content_title-icon fa fa-external-link-alt" />
                                                                    { item.name }
                                                                </a>
                                                            </div>
                                                        </td>
                                                        <td className="table__body-cell">
                                                            <TagsList tagsList={item.tags} />
                                                        </td>
                                                        <td className="table__body-cell">
                                                            <div className="table__actions">
                                                                <a href="/" className="table__actions-btn table__actions-btn-error">
                                                                    <i className="content_title-icon fa fa-trash-alt" />
                                                                    { translate('delete') }
                                                                </a>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                { pager }
                            </div>
                            :
                            <Preloader/>
                    }
                </div>
            </div>
        </div>
    );

    function filterList() {
        return list.filter(item => searchQuery.trim().length ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);
    }
}
const mapStateToProps = state => ({
    list: state.libraryReducer.libraryList,
    loading: state.libraryReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchLibrary: dispatch(fetchLibrary())
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(withPager(AdminLibrary)));