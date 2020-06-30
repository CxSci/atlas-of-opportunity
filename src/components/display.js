import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

let Display = class Display extends React.Component {

  static propTypes = {
    active: PropTypes.object.isRequired,
    select: PropTypes.object.isRequired
  };

  render() {
    const { name, description} = this.props.active;
    const { sa2_name, population, income, ggp, jr, bgi, isDefault} = this.props.select;
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
          <div className='py12 px12 bg-orange-light'>
            <div className='mb1'>
            <h2 className="txt-bold txt-m txt-uppercase color-red inline-block" >Show social bridges</h2>
            <div className="absolute right pr6 inline-block">
            <Icon link name='angle right'/>
            </div>
            </div>
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
  };
}

Display = connect(mapStateToProps)(Display);

export default Display;