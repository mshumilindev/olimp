import { connect } from 'react-redux';
import { fetchStaticInfo } from '../redux/actions/staticInfoActions';
import StaticInfoList from '../components/staticInfo/staticInfoList';

const getStaticInfoList = (state) => {
    return state;
};

const mapStateToProps = state => ({
    staticInfoList: getStaticInfoList(state.staticInfoList),
    loading: getStaticInfoList(state.loading)
});

const mapDispatchToProps = dispatch => ({
    fetchStaticInfo: dispatch(fetchStaticInfo())
});

export default connect(mapStateToProps, mapDispatchToProps)(StaticInfoList)