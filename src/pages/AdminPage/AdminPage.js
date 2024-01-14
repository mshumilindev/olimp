import React, { useContext, useState, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import siteSettingsContext from "../../context/siteSettingsContext";
import { fetchPage, updatePage } from "../../redux/actions/staticInfoActions";
import Preloader from "../../components/UI/preloader";
import ContentEditor from "../../components/UI/ContentEditor/ContentEditor";
import Form from "../../components/Form/Form";
import { useParams } from "react-router-dom";

const AdminPage = ({ fetchPage, pageData, updatePage, loading }) => {
  const params = useParams();
  const { translate, lang } = useContext(siteSettingsContext);
  const [page, setPage] = useState(null);
  const [initialPage, setInitialPage] = useState(null);
  const [pageUpdated, setPageUpdated] = useState(false);
  const [pageInfoFields, setPageInfoFields] = useState(null);

  if (!pageData || pageData.slug !== params.pageSlug) {
    fetchPage(params.pageSlug);
  } else {
    if (JSON.stringify(pageData) !== initialPage) {
      setPage(JSON.parse(JSON.stringify(pageData)));
      setInitialPage(JSON.stringify(pageData));
    } else {
      if (!pageInfoFields) {
        setPageInfoFields([
          {
            value: page.featured,
            id: "featured",
            type: "image",
            updated: false,
            size: "100%",
            shape: "landscape",
            icon: "fa fa-image",
          },
          {
            value: page.name.ua,
            id: "name_ua",
            placeholder: translate("title") + " " + translate("in_ua"),
            type: "text",
            updated: false,
          },
          {
            value: page.name.ru,
            id: "name_ru",
            placeholder: translate("title") + " " + translate("in_ru"),
            type: "text",
            updated: false,
          },
          {
            value: page.name.en,
            id: "name_en",
            placeholder: translate("title") + " " + translate("in_en"),
            type: "text",
            updated: false,
          },
        ]);
      }
    }
  }

  useEffect(() => {
    if (page) {
      if (JSON.stringify(page) !== initialPage) {
        setPageUpdated(true);
      } else {
        setPageUpdated(false);
      }
    }
  });

  const setContent = useCallback(
    (newContent) => {
      setPage({
        ...page,
        content: newContent,
      });
    },
    [setPage, page],
  );

  const setInfoFieldValue = useCallback(
    (fieldID, value) => {
      const newPageName = page.name;

      pageInfoFields.find((item) => item.id === fieldID).value = value;
      pageInfoFields.find((item) => item.id === fieldID).updated = !!value;

      if (fieldID === "name_ua") {
        newPageName.ua = value;
      }
      if (fieldID === "name_ru") {
        newPageName.ru = value;
      }
      if (fieldID === "name_en") {
        newPageName.en = value;
      }

      setPage({
        ...page,
        name: {
          ...newPageName,
        },
        featured: fieldID === "featured" ? value : page.featured,
      });
    },
    [page, pageInfoFields, setPage],
  );

  return (
    <div className="adminPage">
      <section className="section">
        <div className="section__title-holder">
          <h2 className="section__title">
            <i className={"content_title-icon fa fa-file"} />
            <span className="section__title-separator">
              {translate("pages")}
            </span>
            {page ? (page.name[lang] ? page.name[lang] : page.name.ua) : ""}
          </h2>
          <div className="section__title-actions">
            <span>
              <a
                href="/"
                className="btn btn__success"
                onClick={(e) => onUpdatePage(e)}
                disabled={!pageUpdated}
              >
                <i className="content_title-icon fa fa-save" />
                {translate("save")}
              </a>
            </span>
          </div>
          {loading ? <Preloader size={60} /> : null}
        </div>
        <div className="grid">
          <div className="grid_col col-8">
            <div className="widget">
              <div className="widget__title">
                <i className="content_title-icon fa fa-file-alt" />
                {translate("content")}
              </div>
              {page ? (
                <ContentEditor
                  contentType="content"
                  content={page.content}
                  types={["text", "media", "divider", "page"]}
                  setLessonContent={(newContent) => setContent(newContent)}
                  loading={loading}
                  setUpdated={() => true}
                />
              ) : (
                <Preloader />
              )}
            </div>
          </div>
          <div className="grid_col col-4">
            <div className="widget">
              <div className="widget__title">
                <i className="content_title-icon fa fa-info" />
                {translate("info")}
              </div>
              {page ? (
                <Form
                  fields={pageInfoFields}
                  setFieldValue={setInfoFieldValue}
                  loading={loading}
                />
              ) : (
                <Preloader />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  function onUpdatePage(e) {
    e.preventDefault();

    if (pageUpdated) {
      setInitialPage(JSON.stringify(page));
      updatePage(page.id, {
        ...page,
      });
      setPageInfoFields([
        {
          value: page.featured,
          id: "featured",
          type: "image",
          updated: false,
          size: "100%",
          shape: "landscape",
          icon: "fa fa-image",
        },
        {
          value: page.name.ua,
          id: "name_ua",
          placeholder: translate("title") + " " + translate("in_ua"),
          type: "text",
          updated: false,
        },
        {
          value: page.name.ru,
          id: "name_ru",
          placeholder: translate("title") + " " + translate("in_ru"),
          type: "text",
          updated: false,
        },
        {
          value: page.name.en,
          id: "name_en",
          placeholder: translate("title") + " " + translate("in_en"),
          type: "text",
          updated: false,
        },
      ]);
    }
  }
};
const mapStateToProps = (state) => ({
  pageData: state.staticInfoReducer.page,
  loading: state.staticInfoReducer.loading,
});
const mapDispatchToProps = (dispatch) => ({
  fetchPage: (slug) => dispatch(fetchPage(slug)),
  updatePage: (pageID, info) => dispatch(updatePage(pageID, info)),
});
export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
