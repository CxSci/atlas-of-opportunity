import React from 'react';

import SidebarDialog from "./SidebarDialog";
import LozengeButton from './LozengeButton';

const modalText = {
  fontSize: "14px",
  lineHeight: "150%",
  color: "#333333",
  marginBottom: 20,
}

const RecommendationDialog = () => {
    return (
        <SidebarDialog id="recommendation" greedyHeight={true}>
            <p style={modalText}>Not sure where to start? Try the Recommendation Tool.</p>
            <LozengeButton
                buttonType="prominent"
                buttonSize="small"
                showChevron={true}
                url="/recommendation"
                text="Recommendation Tool"
            />
        </SidebarDialog>
    )
}

export default RecommendationDialog;