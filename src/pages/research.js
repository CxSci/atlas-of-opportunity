import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setModal } from "../redux/action-creators";

import uniqueShop from "../assets/unique_shop.png";
import jobsIncreases from "../assets/jobs_increases.png";
import GDP from "../assets/GDP.png";
import consumptionDiversity from "../assets/consumption_diversity.png";

import Container from "../components/container";

const Research = class Research extends Component {
  static propTypes = {
    modal: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    if (this.props.modal === true) {
      setModal(false);
    }
  }

  render() {
    const content = {
      fontSize: "16px",
      textAlign: "justify",
      marginBottom: "15px",
    };
    const image = {
      width: "100%",
    };
    return (
      <Container title="Research">
        <p style={content}>
          What new advantages can communities have if they have the ability to
          analyze their data? People often think of monetizing personal data,
          but the reality is that while there is a great deal of value in
          aggregate data for specific purposes, there is no market mechanism for
          data exchange, and so personal data does not have very much value on
          an individual basis. Personal data, and community data, will only
          become a serious source of revenue when privacy-respecting data
          exchanges become a major part of the general financial and economic
          landscape.
        </p>
        <p style={content}>
          However, monetization is only a minor part of data’s value to a
          community, especially in today’s economic climate. A greater source of
          value is in improving the living conditions of the community members,
          and ensuring the success of future generations. For instance, the
          COVID-19 pandemic has highlighted major disparities in public health
          between different communities. Data about community public health is
          necessary to address these disparities, but today that data is
          unavailable to communities in all but the most general terms. Chapter
          7 addresses this problem in more detail.
        </p>
        <br />
        <h2>Economic Growth</h2>
        <p style={content}>
          Communities need data about their economic health in order to plan
          their future, but the data required for neighborhood-level planning is
          unavailable to them. Only the aggregate statistics of production and
          wage distribution used by economists are generally available. With the
          development of community-owned data cooperatives this could change
          dramatically.
        </p>
        <p style={content}>
          As an example, Chong, Bahrami , Chen, Bozkaya and Pentland [28]
          recently developed a neighborhood attractiveness measure that uses the
          diversity of amenities within a neighborhood to predict the volume and
          diversity of human flows into that neighborhood, which in turn
          predicts economic productivity and economic growth on a
          neighborhood-by-neighborhood basis.
        </p>
        <p style={content}>
          Their attractiveness measure is based on the relationship shown in
          Figure 1, which illustrates the connection between the number of
          unique shop categories in a neighborhood (defined in terms of the
          standardized merchant category code, MCC) and the total flows of
          people into each district over a period of 1 year. The very large
          correlation of 0.789 shows that measuring neighborhood attractiveness
          by diversity of shops and public spaces can be excellent predictor of
          future foot traffic. This data is from the city of Istanbul, but
          similar relationships have been demonstrated in the EU, US, and in
          Australia.
        </p>
        <img style={image} src={uniqueShop} alt={""} />
        <p>
          <b>Figure 1</b> Scatter plot of the number of unique shop categories
          within a neighborhood versus total inflow (visitor) volumes of each
          neighborhood.
        </p>
        <p style={content}>
          There is a dynamic relationship between the attractiveness of a
          neighborhood and its economic growth. The attractiveness of diverse
          amenities (e.g., parks and other public spaces), increases the inflow
          of people from different neighborhoods. This inflow in turn creates
          opportunities that boosts investments and increases the availability
          of even more diverse amenities.
        </p>
        <p style={content}>
          The neighborhood attractiveness measure of [28] allows communities use
          their private data, specifically the pattern of in-store purchases, to
          predict what new stores and amenities will increase the economic
          productivity of the neighborhood. Moreover, as a neighborhood becomes
          more attractive, through new amenities and more diverse visitors,
          entrepreneurs respond by offering yet more diverse amenities in order
          to cater to the tastes and preferences of the new people visiting the
          neighborhood. Consequently, the same sort of community data can be
          used to predict future economic growth of the community.
        </p>
        <img style={image} src={consumptionDiversity} alt={""} />
        <p>
          Figure 5. (left) diversity of consumption, (right) year-on-year
          economic growth for neighborhoods within the city of Beijing. The
          diversity of consumption (or the diversity of visitors) predicts up to
          50% of the variance in year-on-year economic growth for Beijing, as
          well as for US and EU cites{" "}
        </p>
        <p style={content}>
          Figure 5 illustrates the measured relationship between neighborhood
          attractiveness and the percentage changes in economic indicators for
          neighborhoods Beijing, similar results have been obtained on three
          different continents. In all three cases, we see that the diversity of
          consumption is a strong predictor of economic growth, with the
          correlation with the economic growth in the following year at 0.71
          (Istanbul), 0.54 (Beijing) and 0.52 (U.S).
        </p>
        <p style={content}>
          Figure 5 illustrates the measured relationship between neighborhood
          attractiveness and the percentage changes in economic indicators for
          neighborhoods Beijing, similar results have been obtained on three
          different continents. In all three cases, we see that the diversity of
          consumption is a strong predictor of economic growth, with the
          correlation with the economic growth in the following year at 0.71
          (Istanbul), 0.54 (Beijing) and 0.52 (U.S).
        </p>
        <img style={image} src={GDP} alt={""} />
        <p>
          Figure 6. Diversity of consumption versus year-on-year growth in GDP
          after controlling for population density, housing price, and the
          geographical centrality
        </p>
        <p style={content}>
          However, economic growth is complex, and influenced by many factors.
          However, as shown in Figure 6, even if we also account for factors
          such as population density, housing price index, and the geographical
          centrality of the district within the city, the predictive ability of
          community diversity data with economic growth is still quite strong,
          with correlations of R=0.41 (Beijing), 0.72 (Istanbul), and 0.57 (US),
          providing evidence on how the attractiveness of local amenities and
          services is a strong determinant of neighborhood growth.
        </p>
        <br />
        <h2>Small business planning</h2>
        <p style={content}>
          By using community data, we can begin to build more vibrant,
          economically successful neighborhoods. For instance, to promote growth
          in a specific neighborhood we can alter transportation networks to
          make the neighborhood accessible to more diverse populations, and
          invest in diverse stores and amenities in order to attract diverse
          flows of people.{" "}
        </p>
        <p style={content}>
          Importantly, we can use community data to evaluate how to allocate
          investments to maximize the expected impact on the economy of the
          target neighborhood. Communities need not rely on annualized values of
          traditional economic indicators for planning purposes but would
          instead be able to make reliable estimates of what sort of stores will
          succeed, and determine whether or not they will contribute to the
          general prosperity of the neighborhood. For instance, Netto, Bahrami,
          Brei, Bozkaya, Balcısoy, and Pentland [XX] have shown that by
          combining a generic model of how people move around the city (the
          “gravity model”) with community data describing the concentration and
          variety of amenities in the neighborhood they can accurately predict
          the foot traffic and sales of proposed stores and public anemities.{" "}
        </p>
        <p style={content}>
          The method they developed is far better than existing methods, and is
          flexible and robust enough to estimate other key marketing variables,
          such as anticipated market share, units sold, or other forecasting
          goals. Consequently, community planners may use it for tax estimation
          purposes or to understand which type of new stores or community
          resources (parks, etc) can stimulate population flow towards different
          neighborhoods, plan the city dynamics and commercial growth,
          stimulating the flow of people into different areas to boost the local
          economy.{" "}
        </p>
        <br />
        <h2>Employment</h2>
        <p style={content}>
          Communities also need to promote the jobs and skills that increase
          worker pay, create employment, and make their economy resilient to
          downturns. Moro, Frank, Pentland, Rutherford, Cebrian and Rahwan [4]
          have developed a skill connectivity measure for using community data
          to predict which skills will contribute most to the communities labor
          market resilience. This skill connectivity measure is an
          ecologically-inspired employment matching process constructed from the
          similarity of every occupation’s skill requirements
        </p>
        <p style={content}>
          Looking at all of the cities within the US, they found that this skill
          connectivity measure predicted the economic resilience of cities to
          economic downturns. The reason skill connectivity is so important is
          simple: if workers can easily move from one type of job to another
          because the two jobs share similar skills, then they are less likely
          to remain unemployed for long.
        </p>
        <p style={content}>
          As illustrated in Figure 7, cities with greater skill connectivity
          experienced lower unemployment rates during the 2008 Great Recession,
          had increasing wage bills, and workers of occupations with high degree
          of connectivity within a city’s job network enjoy higher wages than
          their peers elsewhere. Skill connectivity, together with employment
          diversity, contributed the most toward lowering the unemployment rate
          during the 2007 Great Recession, as illustrated below.
        </p>
        <img style={image} src={jobsIncreases} alt={""} />
        <p>
          Figure 7: More skills connectivity between jobs increases employment
          resilience
        </p>
        <p style={content}>
          Consequently, job training and economic development programs that
          promote skill overlap between the occupations within a community are
          likely to grow local labor markets and promote general economic
          resilience. Such job connectivity is also likely to be important in
          addressing technology-driven labor challenges, such as AI and robotic
          automation.
        </p>
        <br />
        <h2>Building Social Capital</h2>
        <p style={content}>
          Central to any community is the trust and social capital within the
          community. Today many people have little trust in other members of
          their community, and this is the source of many problems including
          crime, poverty, and children’s developmental outcomes. Many lines of
          research show that one of the most reliable ways to create community
          trust and social capital is through cooperative community projects,
          and especially those that are community-owned (see Chapter 5), not
          just because such projects promote more communication and habits of
          cooperation within the community but also because they help give
          community members a sense of shared destiny and shared identity.
        </p>
        <p style={content}>
          Extremely good measures of community trust and social capital can be
          derived from community data in a way that protects privacy, by looking
          at the frequency and diversity of within-community calls, messaging,
          and co-visiting (going to the same meetings, stores, parks, etc. at
          the similar times) [7]. For instance, in [7] we found we could use
          this measure to very accurately predict likelihood of giving help in
          time of sickness, willingness to loan money, and willingness to help
          with childcare.{" "}
        </p>
        <p style={content}>
          Communities that talk together and build together are resilient and,
          over the long term, more successful. Knowing about the levels of trust
          in a community allows community leaders to prioritize projects that
          build more and more inclusive trust and social capital. Access to
          community-level data is what can make this possible.
        </p>
      </Container>
    );
  }
};

function mapStateToProps(state) {
  return {
    modal: state.modal,
  };
}

export default connect(mapStateToProps)(Research);
