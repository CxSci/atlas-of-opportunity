import React, { Component } from "react";
import livingLab from "../assets/livinglab.png";
import banksa from "../assets/banksa.png";
import dspark from "../assets/dspark.png";
import StickyFooter from "react-sticky-footer";

const Footer = class Footer extends Component {
  render() {
    const footerStyle = {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "60px",
      alignItems: "center",
      justifyContent: "center",
    };
    const logoStyle = {
      width: "8%",
      margin: "0 10px",
    };

    return (
      <StickyFooter
        bottomThreshold={50}
        normalStyles={{
          backgroundColor: "rgba(153, 153, 153, 0)",
          padding: "0.5rem",
        }}
        stickyStyles={{
          backgroundColor: "rgba(255,255,255,.8)",
          padding: "2rem",
        }}
      >
        <div className="footer" style={footerStyle}>
          <img style={logoStyle} src={livingLab} alt={""}></img>
          <img style={logoStyle} src={banksa} alt={""}></img>
          <img style={logoStyle} src={dspark} alt={""}></img>
        </div>
      </StickyFooter>
    );
  }
};
export default Footer;
