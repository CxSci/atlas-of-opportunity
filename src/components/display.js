import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import * as Constants from '../constants'
import { setFlowDirection } from '../redux/action-creators'

let Display = class Display extends React.Component {

  static propTypes = {
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired,
    flowDirection: PropTypes.string.isRequired,
  };

  onFlowChange = (e) => {
    let direction = e.target.value;
    this.flowDirection = direction;
    console.log(direction);
    setFlowDirection(direction);
  }

  render() {
    // const { name, description} = this.props.active;
    const { sa2_name, population, income, ggp, jr, bgi, isDefault} = this.props.select;
    const { flowDirection } = this.props;
    if (isDefault){
      return (
        <div className="bg-white absolute bottom right mr12 mb36 shadow-darken10 z1 wmax240">
          <div className="py12 px12">
            <p className='txt-s'>Select a community to learn more about opportunity in that area.
            </p>
          </div>
        </div>
        )
    }
    return (
      <div>
        <div className="bg-white absolute top right mr12 mt24 shadow-darken10 z1 w240">
          <div className="py12 px12">
            <div className='mb6'>
              <h2 className="txt-bold txt-l txt-uppercase block">{sa2_name}</h2> 
            </div>
          </div>
          <div className="py12 px12 bg-orange-faint">
            <div className='mb6'>
              <h2 className="txt-bold txt-m color-orange block">Population</h2>
              <p className='txt-s'>{population}</p>
            </div>
            <div className='mb6'>
              <h2 className="txt-bold txt-m color-orange block">Median Income</h2>
              <p className='txt-s'>{income}</p>
            </div>
          </div>
          <div className="py12 px12">
            <div className='mb6'>
              <h2 className="txt-bold txt-m block">GDP Growth Potential</h2>
              <p className='txt-s'>{ggp}</p>
            </div>
            <div className='mb6'>
              <h2 className="txt-bold txt-m block">Job Resilience</h2>
              <p className='txt-s'>{jr}</p>
            </div>
            <div className='mb6'>
            <h2 className="txt-bold txt-m block">Business Growth Index</h2>
              <p className='txt-s'>{bgi}</p>
            </div>
          </div>
          <div id='options' className = 'pb12 px12 bg-orange-faint'>
            <form>
              <p className = 'pt6 txt-m txt-bold'>Change flow direction</p>
              <div>
                <label className="p12 txt-s block">
                <input
                  type="radio"
                  name='flow'
                  value={Constants.FLOW_OUT}
                  checked={flowDirection === Constants.FLOW_OUT}
                  onChange={this.onFlowChange}/>
                 Outflow
                </label>
              </div>
              <div>
                <label className="p12 txt-s block">
                <input
                  type="radio"
                  name='flow'
                  value={Constants.FLOW_IN}
                  checked={flowDirection === Constants.FLOW_IN}
                  onChange={this.onFlowChange}/>
                 Inflow
                </label>
              </div>
              <div>
                <label className="p12 txt-s block">
                <input
                  type="radio"
                  name='flow'
                  value={Constants.FLOW_BI}
                  checked={flowDirection === Constants.FLOW_BI}
                  onChange={this.onFlowChange}/>
                 Bi-directional
                </label>
              </div>
            </form>
          </div>
        </div>
        <div className="bg-white absolute bottom right mr12 mb36 shadow-darken10 z1 wmax240">
          <div className="py12 px12">
            <p className='txt-s'>Select a community to learn more about opportunity in that area.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    active: state.active,
    select: state.select,
    flowDirection: state.flowDirection,
  };
}

Display = connect(mapStateToProps)(Display);

export default Display;