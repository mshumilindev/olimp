import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

function usePrevious(value) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

const withPager = (WrappedComponent) => {
  return function Pager(props) {
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(
      props.showPerPage ? props.showPerPage : 1,
    );
    const [totalPages, setTotalPages] = useState(
      Math.ceil(props.list ? props.list.length / limit : 0),
    );
    const prevList = usePrevious(props.list);
    const prevLimit = usePrevious(props.showPerPage);

    useEffect(() => {
      if (props.list) {
        if (
          JSON.stringify(prevList) !== JSON.stringify(props.list) ||
          prevLimit !== props.showPerPage
        ) {
          setLimit(props.showPerPage);
          setTotalPages(Math.ceil(props.list.length / props.showPerPage));
          setOffset(0);
        }
      }
    }, [prevLimit, prevList, props.list, props.showPerPage]);

    return (
      <WrappedComponent
        {...props}
        list={pagedList(props.list)}
        pager={getPager()}
      />
    );

    function pagedList() {
      let newList = props.list;

      if (newList) {
        newList = JSON.parse(JSON.stringify(newList)).splice(
          limit * offset,
          limit,
        );
      }

      return newList;
    }

    function getPager() {
      const pagerArr = [];
      let i = 0;

      while (pagerArr.length < totalPages) {
        pagerArr.push({
          id: i + 1,
        });
        i++;
      }

      return (
        <div className="pager" hidden={totalPages <= 1}>
          {pagerArr.map((item) => {
            return (
              <span
                className={classNames("pager__item", {
                  active: item.id === offset + 1,
                })}
                key={item.id}
                onClick={() => setOffset(item.id - 1)}
              >
                {item.id}
              </span>
            );
          })}
        </div>
      );
    }
  };
};

export default withPager;
