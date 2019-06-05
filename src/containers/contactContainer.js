import { connect } from 'react-redux';
import { fetchContact } from '../redux/actions/contactActions';
import ContactList from '../components/contact/contactList';

const getContactList = (state) => {
    return state;
};

const mapStateToProps = state => ({
    contactList: getContactList(state.contactList),
    loading: getContactList(state.loading)
});

const mapDispatchToProps = dispatch => ({
    fetchContact: dispatch(fetchContact())
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactList)