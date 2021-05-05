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
      width: "100%",
      display:"flex",
      justifyContent:"center",
      alignItems: "center",
      /*    
      position: "fixed",
      left: "0",
      top: "0",
      width: "100%",
      height: "100vh",
      overflowY: "scroll",
      webkitOverflowScrolling: "touch",   
 */
     
    };

    const container = {
      width: "100%",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
    };

    const titleContent = {
      paddingLeft: "40px",
      paddingTop: "25px",

    }

    const childrenContent = {
      paddingLeft: "40px",
      paddingRight: "40px",
      paddingTop: "20px",
      paddingBottom: "20px",
    }

    const titleBox = {
      display: "flex",
      flexDirection: "row",
      height: "70px",
      borderBottom: "1px solid #CCC",  
      width:"100%",
      fontSize: "20px",
    };

    return (
      <div style={popUpBox}>
      <div style={container}>

    
          <h3 style={titleBox}>
            <div style={titleContent}>
              {title}
             </div>
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
