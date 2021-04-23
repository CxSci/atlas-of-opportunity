import React, { Component } from "react";
import PropTypes from "prop-types";

const Container = class Container extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.array,
  };
  render() {
    const { title, children } = this.props;

    const popUpBox = {
      width: "45%",
      height: "100vh",
    }

    const container = {
      width: "45%",
      position: "absolute",
      backgroundColor: "#f9f9f9",

    };
    const content = {
      width: "100%",
      minHeight:"100%",
      margin: '15vh 15vw',
      position: "absolute",
    };
    const titleBox = {
      fontSize: "40px",
      borderBottom: "6px dashed #f79640",
      paddingBottom: "15px",
      marginBottom: "22px",
    };

    return (
      <div style={popUpBox}>
      <div style={container}>
        <div style={content}>
          <h3 style={titleBox}>{title}</h3>
          {children}
        </div>
      </div>
      </div>
    );
  }
};

/* function popUpContainer(){
  const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  return()


} */

export default Container;
