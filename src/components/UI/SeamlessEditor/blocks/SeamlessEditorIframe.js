import React, { useContext, useState, useEffect, useRef } from 'react';
import siteSettingsContext from "../../../../context/siteSettingsContext";

export default function SeamlessEditorIframe({ block, setBlock }) {
  const { translate } = useContext(siteSettingsContext);
  const [ size, setSize ] = useState({width: 0, height: 0});
  block.value = block.value || '';

  const powerpointContainerRef = useRef(null);

  useEffect(() => {
      setTimeout(() => {
          const width = powerpointContainerRef.current.offsetWidth - parseInt(getComputedStyle(powerpointContainerRef.current).paddingLeft);

          setSize({
              width: width,
              height: width * 56.25 / 100 + 23
          });
      }, 0);
  }, []);

  return (
      <div className="seamlessEditor__editor-block-iframe" ref={powerpointContainerRef}>
          <form className="form">
              <div className="form__row">
                  <input type="text" className="form__field" value={block.value} onChange={e => handleChange(e.target.value)} placeholder="Введіть посилання"/>
              </div>
          </form>
          <br/>
          {
              block.value && size.width > 0 ?
                  <div className="seamlessEditor__editor-block-iframe-holder">
                      <iframe
                          src={block.value}
                          style={{width: '100%', height: size.height}} frameBorder="0"
                          allowFullScreen={true}
                          mozAllowFullScreen={true}
                          webkitAllowFullscreen={true} />
                  </div>
                  :
                  <div className="seamlessEditor__editor-block-placeholder">
                    Обʼєкт зʼявиться тут
                  </div>
          }
      </div>
  );

  function handleChange(value) {
    const url = value.startsWith('<iframe') ? value.split(' ').find(item => item.startsWith('src=\"')).replace('src=\"', '').replace('\"', '') : value;

    setBlock({
        ...block,
        value: url
    })
  }
}
