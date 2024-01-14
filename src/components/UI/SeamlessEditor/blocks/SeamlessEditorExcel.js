import React, { useContext } from "react";
import siteSettingsContext from "../../../../context/siteSettingsContext";
import Form from "../../../../components/Form/Form";
import { OutTable, ExcelRenderer } from "react-excel-renderer";

export default function SeamlessEditorExcel({ block, setBlock }) {
  const { translate, lang } = useContext(siteSettingsContext);
  block.value = block.value || {
    ua: "",
    ru: "",
    en: "",
  };
  const formFields = [
    {
      type: "file",
      id: block.id,
      value: "",
      size: "100%",
      icon: "fas fa-file-excel",
      customSize: true,
      label: translate("choose_file"),
      ext: ".xls, .xlsx",
    },
  ];

  return (
    <div className="seamlessEditor__editor-block-excel">
      <Form
        fields={formFields}
        setFieldValue={(fieldID, value) => handleChange(fieldID, value)}
      />
      <br />
      {block.value && block.value[lang] ? (
        <div className="table__holder">
          <OutTable
            data={block.value[lang].rows}
            columns={block.value[lang].cols}
            tableClassName="table"
            tableHeaderRowClass="table__head"
          />
        </div>
      ) : (
        <div className="seamlessEditor__editor-block-placeholder">
          Документ Excel з'явиться тут
        </div>
      )}
    </div>
  );

  function handleChange(id, value) {
    ExcelRenderer(value, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        console.log(resp);
        setBlock({
          ...block,
          value: {
            ...block.value,
            [lang]: resp,
          },
        });
      }
    });
    // const reader = new FileReader();
    // reader.onloadend = function(event) {
    //   const arrayBuffer = reader.result;
    //
    //   mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then(function (resultObject) {
    //   setBlock({
    //     ...block,
    //     value: {
    //     ...block.value,
    //     [lang]: resultObject.value
    //     }
    //   });
    //   });
    // };
    // reader.readAsArrayBuffer(value);
  }
}
