import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactComponent as CloseIcon} from "../assets/closeIconPage.svg";

import { Link } from "react-router-dom";

const Container = class Container extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.array,
  };


  render() {
    const { title, children } = this.props;

    const popUpBox = {
      width: "100%",
      height: "100%",
      background: "black",
      opacity: "0.5",
      position: "absolute",
      zIndex: "3",
      pointerEvents: "auto",
      top: "0",
    };

    const container = {
      position: "fixed",
      zIndex: "4",
      display:"flex",
      justifyContent:"center",
      alignItems: "center",
      width: "50%",
      maxHeight:"60%",
      top:"20%",
      left:"25%",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      flexDirection: "column",
      pointerEvents: "auto",


    };

    const titleBox = {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      lineHeight: "20px",
      padding: "30px 40px 20px 40px",
      borderBottom: "1px solid #CCC",  
      width:"100%",
      fontSize: "24px",
      fontWeight: "500"

    };

    const childrenContent = {
      width: "100%",
      padding: "20px 40px 20px 40px",
      overflowY: "scroll",
    }

    return (
        <div>
              <Link
              to="/"
              style={popUpBox}
              />

          <div style={container}>
              <h3 style={titleBox}>
                  {title}
                 <Link
                  to="/"
                ><CloseIcon/></Link>
                </h3>
    
             <div style={childrenContent}>
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
