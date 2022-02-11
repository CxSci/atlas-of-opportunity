import React from "react";
import PropTypes from "prop-types";

import "../css/footer.css";
import { ReactComponent as DSparkLogoLight} from "../assets/branding/dspark_mono_light.svg";
import { ReactComponent as LivingLabLogoLight} from "../assets/branding/mit_living_lab_mono_light.svg";
import { ReactComponent as BankSALogoLight} from "../assets/branding/bank_sa_mono_light.svg";
import { ReactComponent as SAGovLogoLight} from "../assets/branding/government_of_south_australia_mono_light.svg";
import { ReactComponent as OptusLogoLight} from "../assets/branding/optus_mono_light.svg";
import { ReactComponent as DSparkLogoDark} from "../assets/branding/dspark_mono_dark.svg";
import { ReactComponent as LivingLabLogoDark} from "../assets/branding/mit_living_lab_mono_dark.svg";
import { ReactComponent as BankSALogoDark} from "../assets/branding/bank_sa_mono_dark.svg";
import { ReactComponent as SAGovLogoDark} from "../assets/branding/government_of_south_australia_mono_dark.svg";
import { ReactComponent as OptusLogoDark} from "../assets/branding/optus_mono_dark.svg";

function Footer(props) {
  const inDarkMode = props.inDarkMode;
  const footerBackground = props.inDarkMode ? 'dark' : 'light';

  return (
    <div className={`footerContainer ${footerBackground}`}>
        {inDarkMode ? (
            <div className={`footer`}>
                <LivingLabLogoLight/>
                <BankSALogoLight/>
                <DSparkLogoLight/>
                <OptusLogoLight/>
                <SAGovLogoLight/>
            </div>
        ) : (
            <div className={`footer`}>
                <LivingLabLogoDark/>
                <BankSALogoDark/>
                <DSparkLogoDark/>
                <OptusLogoDark/>
                <SAGovLogoDark/>
            </div>
        )}    
    </div>
  );
}

Footer.propTypes = {
    inDarkMode: PropTypes.bool.isRequired,
};

export default Footer;
