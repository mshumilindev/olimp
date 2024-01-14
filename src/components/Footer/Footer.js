import React, { useContext } from "react";
import "./footer.scss";
import { connect } from "react-redux";
import { fetchStaticInfo } from "../../redux/actions/staticInfoActions";
import { fetchContact } from "../../redux/actions/contactActions";
import Preloader from "../UI/preloader";
import Contact from "../../components/Contact/Contact";
import "../../pages/StudentContact/studentContact.scss";
import { Link } from "react-router-dom";
import siteSettingsContext from "../../context/siteSettingsContext";

function Footer({ staticInfoList, contactList, logo, siteName }) {
  const { translate, lang } = useContext(siteSettingsContext);

  return (
    <footer className="footer">
      <div className="footer__inner">
        {contactList && staticInfoList ? (
          <>
            <div className="footer__logo">
              <Link to="/">
                <img
                  src={logo.url}
                  alt={siteName[lang] ? siteName[lang] : siteName["ua"]}
                />
              </Link>
            </div>
            <div className="grid">
              {contactList.length ? (
                <div className="grid_col col-12 tablet-col-6">
                  <Contact
                    contactList={contactList.sort((a, b) => a.order - b.order)}
                  />
                </div>
              ) : null}
              <div className="grid_col col-12 tablet-col-6">
                {staticInfoList.length ? _renderStaticInfo() : null}
              </div>
            </div>
          </>
        ) : (
          <Preloader />
        )}
      </div>
    </footer>
  );

  function _renderStaticInfo() {
    return (
      <div className="footer__list">
        <h4 className="footer__heading">{translate("info")}</h4>
        {staticInfoList.map((page) => {
          return (
            <div className="footer__list-item" key={page.id}>
              <div className="footer__list-icon">
                <i className="fa fa-file" />
              </div>
              <Link to={"/page/" + page.slug}>
                {page.name[lang] ? page.name[lang] : page.name["ua"]}
              </Link>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  staticInfoList: state.staticInfoReducer.staticInfoList,
  logo: state.siteSettingsReducer.siteSettingsList
    ? state.siteSettingsReducer.siteSettingsList.logo
    : null,
  siteName: state.siteSettingsReducer.siteSettingsList
    ? state.siteSettingsReducer.siteSettingsList.siteName
    : null,
  contactList: state.contactReducer.contactList,
});

const mapDispatchToProps = (dispatch) => ({
  fetchStaticInfo: dispatch(fetchStaticInfo()),
  fetchContact: dispatch(fetchContact()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
