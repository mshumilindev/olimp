import React from "react";
import Form from "../Form/Form";

export default class AdminTranslationsListItem extends React.Component {
  constructor(props) {
    super();

    this.state = {
      currentItem: {
        type: "text",
        name: props.lang + "_" + props.itemKey,
        id: props.lang + "_" + props.itemKey,
        required: true,
        updated: false,
        value: props.item,
      },
    };

    this.setFieldValue = this.setFieldValue.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.item !== this.props.item) {
      this.setState((state) => {
        return {
          currentItem: {
            ...state.currentItem,
            updated: false,
          },
        };
      });
    }
    if (
      JSON.stringify(nextState.currentItem) ===
        JSON.stringify(this.state.currentItem) &&
      nextProps.item === this.props.item
    ) {
      return null;
    }

    return true;
  }

  render() {
    return (
      <Form
        setFieldValue={this.setFieldValue}
        fields={[this.state.currentItem]}
      />
    );
  }

  setFieldValue(fieldID, value) {
    this.setState((state) => {
      return {
        currentItem: {
          ...state.currentItem,
          value: value,
          updated: value !== this.props.item,
        },
      };
    });
  }
}
