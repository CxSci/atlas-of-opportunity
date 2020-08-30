import React from "react";
import livingLab from "../assets/livinglab.png";
import banksa from "../assets/banksa.png";
import dspark from "../assets/dspark.png";
import StickyFooter from "react-sticky-footer";
import { footerStyle, logoStyle } from "../styles/footer";

const Footer = () => {
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
};
export default Footer;
