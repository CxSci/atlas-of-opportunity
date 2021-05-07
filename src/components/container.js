import React, { Component } from "react";
import PropTypes from "prop-types";
import { ReactComponent as CloseIcon} from "../assets/closeIconPage.svg";
import { setHeaderOption } from "../redux/action-creators";

import { Link } from "react-router-dom";

const Container = class Container extends Component {

  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.array,
  };

  state = {
    showPopUp: true,
  };

  togglePopUp = () => {
    this.setState(prevState => ({ showPopUp: !prevState.showPopUp }),);
  };


  render() {
    const { showPopUp } = this.state;
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

    const titleContent = {
      width: "100%",
      paddingTop: "28px",
      paddingBottom: "20px",
      paddingLeft: "40px",

    }

    const childrenContent = {
      width: "100%",
      paddingLeft: "40px",
      paddingRight: "40px",
      paddingTop: "20px",
      paddingBottom: "20px",
      overflowY: "scroll",
      webkitOverflowScrolling: "touch",   

    }

    const titleBox = {
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid #CCC",  
      width:"100%",
      fontSize: "20px",
    };


    const closeIcon = {
      display: "flex",
      flexDirection: "column",
      paddingTop: "26px",
      paddingBottom: "20px",
      paddingRight: "30px",

      cursor: "pointer",
    }
    return (

      <div>
        
        {
          this.state.showPopUp
            ? 
            <div>
              <Link
              to="/"
              style={popUpBox}
              className={`popUpBox ${showPopUp ? "show" : ""}`}
              onClick={() => { 
              setHeaderOption("/");
              this.setState({ /* turn stuff off */
                showPopUp: false }) }}
              />

          <div style={container} className={`popUpBoxContainer ${showPopUp ? "show" : ""}`}>
              <h3 style={titleBox}>
                <div style={titleContent}>
                  {title}
                 </div>

                 <Link style={closeIcon}
                  to="/"
                 onClick={() => { 
                  setHeaderOption("/");
                  this.setState({ /* turn stuff off */
                  showPopUp: false }) }}
                ><CloseIcon/></Link>
                </h3>
    
             <div style={childrenContent}>
                {children}
              </div>
              </div>

              </div>
            : null
          }   

      

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
