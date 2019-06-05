import { connect } from 'react-redux';
import { fetchNav } from '../redux/actions/mainActions';
import Layout from '../pages/layout';

const getContactList = (state) => {
    return state;
};

const mapStateToProps = state => ({
    nav: getContactList(state.nav),
    loading: getContactList(state.loading)
});

const mapDispatchToProps = dispatch => ({
    fetchNav: dispatch(fetchNav())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout)