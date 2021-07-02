import React from 'react';
import RecommendationTool from '../components/RecommendationTool';
import {RECOMMENDATION_DUMMY_DATA} from '../constants'
import ModalContainer from '../components/ModalContainer';

const Recommendation = () => {
    return <ModalContainer title="Recommendation Tool">        
        <RecommendationTool formData={RECOMMENDATION_DUMMY_DATA}/>
    </ModalContainer>
};

export default Recommendation