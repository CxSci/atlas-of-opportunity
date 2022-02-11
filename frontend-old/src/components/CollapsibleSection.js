import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Collapsible from "react-collapsible";
import { updateCollapsibleState } from "../redux/action-creators";

const CollapsibleSection = (props) => {
  const { title, collapsibleState } = props;

  const onOpen = (key) => updateIsOpen(key, true);
  const onClose = (key) => updateIsOpen(key, false);

  const isOpen = (key) => {
    const value = collapsibleState && collapsibleState[key];
    return value ?? false;
  }

  const updateIsOpen = (key, value) => {
    const newValue = {...collapsibleState, [key]: value};
    updateCollapsibleState(newValue);
  }

  return (
    <Collapsible trigger={title}
      open={isOpen(title)}
      onOpening={() => onOpen(title)}
      onClosing={() => onClose(title)}
      lazyRender={true}
    >
      {props.children}
    </Collapsible>
  );
}

CollapsibleSection.propTypes = {
  title: PropTypes.string,
  collapsibleState: PropTypes.object,
  children: PropTypes.node,
}

const mapStateToProps = (state) => ({
  collapsibleState: state.collapsibleState,
});

export default connect(mapStateToProps)(CollapsibleSection);
