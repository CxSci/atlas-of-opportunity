import React from 'react';
import RecommendationTool from '../components/RecommendationTool';
import {RECOMMENDATION_DUMMY_DATA} from '../constants'
import Container from '../components/container';

const Recommendation = () => {
    return <Container title="Recommendation Tool">        
        <RecommendationTool data={RECOMMENDATION_DUMMY_DATA}/>
    </Container>
};

export default Recommendation