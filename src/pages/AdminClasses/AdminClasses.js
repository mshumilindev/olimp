import React, { useContext } from 'react';
import {connect} from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import withFilters from "../../utils/withFilters";
import {fetchClasses} from "../../redux/actions/classesActions";

const AdminClassesList = React.lazy(() => import('../../components/AdminClassesList/AdminClassesList'));

function AdminClasses({classesList, loading}) {
    const { translate } = useContext(siteSettingsContext);

    return (
        <div className="adminTranslations">
            <section className="section">
                <div className="section__title-holder">
                    <h2 className="section__title">
                        <i className={'content_title-icon fa fa-graduation-cap'} />
                        { translate('classes') }
                    </h2>
                    <div className="section__title-actions">
                        <span>
                            <a href="/" className="btn btn_primary" onClick={e => createClass(e)}>
                                <i className="content_title-icon fa fa-plus"/>
                                { translate('create_class') }
                            </a>
                        </span>
                    </div>
                </div>
                <AdminClassesList list={classesList} loading={loading}/>
            </section>
        </div>
    );

    function createClass(e) {
        e.preventDefault();
    }
}
const mapStateToProps = state => ({
    classesList: state.classesReducer.classesList,
    loading: state.classesReducer.loading
});
const mapDispatchToProps = dispatch => ({
    fetchClasses: dispatch(fetchClasses())
});
export default connect(mapStateToProps, mapDispatchToProps)(withFilters(AdminClasses, true));