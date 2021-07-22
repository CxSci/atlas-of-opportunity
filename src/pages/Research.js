import React, { Component } from "react";

import uniqueShop from "../assets/unique_shop.png";
import jobsIncreases from "../assets/jobs_increases.png";
import GDP from "../assets/GDP.png";
import consumptionDiversity from "../assets/consumption_diversity.png";

import ModalContainer from "../components/ModalContainer";

const Research = class Research extends Component {
  render() {
    return (
      <ModalContainer title="Research">
        <h2>Economic Growth</h2>
        <p>
          Communities need data about their economic health in order to plan their future, but the data required for neighborhood-level planning is unavailable to them. Only the aggregate statistics of production and wage distribution used by economists are generally available. With the development of community-owned data cooperatives this could change dramatically.
        </p>
        <p>
          As an example, Chong, Bahrami, Chen, Bozkaya and Pentland [1] recently developed a neighborhood attractiveness measure that uses the diversity of amenities within a neighborhood to predict the volume and diversity of human flows into that neighborhood, which in turn predicts economic productivity and economic growth on a neighborhood-by-neighborhood basis.
        </p>
        <p>
          Their attractiveness measure is based on the relationship shown in Figure 1, which illustrates the connection between the number of unique shop categories in a neighborhood (defined in terms of the standardized merchant category code, MCC) and the total flows of people into each district over a period of 1 year. The very large correlation of 0.789 shows that measuring neighborhood attractiveness by diversity of shops and public spaces can be excellent predictors of future foot traffic. This data is from the city of Istanbul, but similar relationships have been demonstrated in the EU, US, and in Australia.
        </p>
        <img className="imageFill" src={uniqueShop} alt={""} />
        <p>
          Figure 1. Scatter plot of the number of unique shop categories within a neighborhood versus total inflow (visitor) volumes of each neighborhood.
        </p>
        <p>
          There is a dynamic relationship between the attractiveness of a neighborhood and its economic growth. The attractiveness of diverse amenities (e.g., parks and other public spaces), increases the inflow of people from different neighborhoods. This inflow in turn creates opportunities that boost investments and increases the availability of even more diverse amenities.
        </p>
        <p>
          The neighborhood attractiveness measure allows communities to use their private data, specifically the pattern of in-store purchases, to predict what new stores and amenities will increase the economic productivity of the neighborhood. Moreover, as a neighborhood becomes more attractive, through new amenities and more diverse visitors, entrepreneurs respond by offering yet more diverse amenities in order to cater to the tastes and preferences of the new people visiting the neighborhood. Consequently, the same sort of community data can be used to predict future economic growth of the community.
        </p>
        <img className="imageFill" src={consumptionDiversity} alt={""} />
        <p>
          Figure 2. (left) (left) diversity of consumption, (right) year-on-year economic growth for neighborhoods within the city of Beijing. The diversity of consumption (or the diversity of visitors) predicts up to 50% of the variance in year-on-year economic growth for Beijing, as well as for US and EU cities.
        </p>
        <p>
          Figure 2 illustrates the measured relationship between neighborhood attractiveness and the percentage changes in economic indicators for neighborhoods in Beijing, similar results have been obtained on three different continents. In all three cases, we see that the diversity of consumption is a strong predictor of economic growth, with the correlation with the economic growth in the following year at 0.71 (Istanbul), 0.54 (Beijing) and 0.52 (U.S).
        </p>
        <p>
          Figure 3 illustrates the measured relationship between neighborhood attractiveness and the percentage changes in economic indicators for neighborhoods in Beijing, similar results have been obtained on three different continents. In all three cases, we see that the diversity of consumption is a strong predictor of economic growth, with the correlation with the economic growth in the following year at 0.71 (Istanbul), 0.54 (Beijing) and 0.52 (U.S).
        </p>
        <img className="imageFill" src={GDP} alt={""} />
        <p>
          Figure 3. Diversity of consumption versus year-on-year growth in GDP after controlling for population density, housing price, and the geographical centrality
        </p>
        <p>
          However, economic growth is complex, and influenced by many factors. However, as shown in Figure 3, even if we also account for factors such as population density, housing price index, and the geographical centrality of the district within the city, the predictive ability of community diversity data with economic growth is still quite strong, with correlations of R=0.41 (Beijing), 0.72 (Istanbul), and 0.57 (US), providing evidence on how the attractiveness of local amenities and services is a strong determinant of neighborhood growth.
        </p>
        <h2>Small business planning</h2>
        <p>
          By using community data, we can begin to build more vibrant, economically successful neighborhoods. For instance, to promote growth in a specific neighborhood we can alter transportation networks to make the neighborhood accessible to more diverse populations, and invest in diverse stores and amenities in order to attract diverse flows of people.
        </p>
        <p>
          Importantly, we can use community data to evaluate how to allocate investments to maximize the expected impact on the economy of the target neighborhood. Communities need not rely on annualized values of traditional economic indicators for planning purposes but would instead be able to make reliable estimates of what sort of stores will succeed, and determine whether or not they will contribute to the general prosperity of the neighborhood. For instance, Netto, Bahrami, Brei, Bozkaya, Balcısoy, and Pentland [2] have shown that by combining a generic model of how people move around the city (the “gravity model”) with community data describing the concentration and variety of amenities in the neighborhood they can accurately predict the foot traffic and sales of proposed stores and public amenities.
        </p>
        <p>
          The method they developed is far better than existing methods, and is flexible and robust enough to estimate other key marketing variables, such as anticipated market share, units sold, or other forecasting goals. Consequently, community planners may use it for tax estimation purposes or to understand which type of new stores or community resources (parks, etc) can stimulate population flow towards different neighborhoods, plan the city dynamics and commercial growth, stimulating the flow of people into different areas to boost the local economy.
        </p>
        <h2>Employment</h2>
        <p>
          Communities also need to promote the jobs and skills that increase worker pay, create employment, and make their economy resilient to downturns. Moro, Frank, Pentland, Rutherford, Cebrian and Rahwan [3] have developed a skill connectivity measure for using community data to predict which skills will contribute most to the communities labor market resilience. This skill connectivity measure is an ecologically-inspired employment matching process constructed from the similarity of every occupation’s skill requirements.
        </p>
        <p>
          Looking at all of the cities within the US, they found that this skill connectivity measure predicted the economic resilience of cities to economic downturns. The reason skill connectivity is so important is simple: if workers can easily move from one type of job to another because the two jobs share similar skills, then they are less likely to remain unemployed for long.
        </p>
        <p>
          As illustrated in Figure 4, cities with greater skill connectivity experienced lower unemployment rates during the 2008 Great Recession, had increasing wage bills, and workers of occupations with high degree of connectivity within a city’s job network enjoy higher wages than their peers elsewhere. Skill connectivity, together with employment diversity, contributed the most toward lowering the unemployment rate during the 2007 Great Recession, as illustrated below.
        </p>
        <img className="imageFill" src={jobsIncreases} alt={""} />
        <p>
          Figure 4: More skills connectivity between jobs increases employment resilience
        </p>
        <p>
          Consequently, job training and economic development programs that promote skill overlap between the occupations within a community are likely to grow local labor markets and promote general economic resilience. Such job connectivity is also likely to be important in addressing technology-driven labor challenges, such as AI and robotic automation.
        </p>
        <h2>Building Social Capital</h2>
        <p>
          Central to any community is the trust and social capital within the community. Today many people have little trust in other members of their community, and this is the source of many problems including crime, poverty, and children’s developmental outcomes. Many lines of research show that one of the most reliable ways to create community trust and social capital is through cooperative community projects, and especially those that are community-owned, not just because such projects promote more communication and habits of cooperation within the community but also because they help give community members a sense of shared destiny and shared identity.
        </p>
        <p>
          Extremely good measures of community trust and social capital can be derived from community data in a way that protects privacy, by looking at the frequency and diversity of within-community calls, messaging, and co-visiting (going to the same meetings, stores, parks, etc. at the similar times) [4].
        </p>
        <p>
          Communities that talk together and build together are resilient and, over the long term, more successful. Knowing about the levels of trust in a community allows community leaders to prioritize projects that build more and more inclusive trust and social capital. Access to community-level data is what can make this possible.
        </p>
        <h2>Publications</h2>
        <ul>
          <li>
            <a href={"/papers/economic-outcomes-diversity.pdf"}>
              <h3>
                Economic Outcomes Predicted by Diversity in Cities
              </h3>
            </a>
            <p className="pubAuthors">
              Shi Kai Chong, Mohsen Bahrami, Hao Chen, Selim Balcisoy, Burcin
              Bozkaya, and Alex Pentland.
            </p>
            <p>(2020). Forthcoming, EPJ Data Science.</p>
          </li>
          <li>
            {/*<a href={"/papers/gravity-store-sales-prediction.pdf"}>*/}
              <h3>Gravitational Forecast Reconciliation</h3>
            {/*</a>*/}
            <p className="pubAuthors">
              Carla F. Silveira Netto, Mohsen Bahrami, Vinicius Brei, Burcin
              Bozkaya, Selim Balcisoy, and Alex Pentland.
            </p>
            <p> (2020). Under Review.</p>
          </li>
          <li>
            <a href={"/papers/universal-resilience-patterns.pdf"}>
              <h3>
                Universal resilience patterns in labor markets
              </h3>
            </a>
            <p className="pubAuthors">
              Esteban Moro, Morgan R. Frank, Alex Pentland, Alex Rutherford,
              Manuel Cebrian, and Iyad Rahwan.
            </p>
            <p>(2021). Nature communications.</p>
          </li>
          <li>
            <a href={"/papers/idea-flow-economic-growth.pdf"}>
              <h3>
                Diversity of Idea Flows and Economic Growth
              </h3>
            </a>
            <p className="pubAuthors">Alex Pentland.</p>
            <p>(2020). Journal of Social Computing.</p>
          </li>
        </ul>
      </ModalContainer>
    );
  }
};


export default Research;
