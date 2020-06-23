import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

let Display = class Display extends React.Component {

  static propTypes = {
    active: PropTypes.object.isRequired
  };

  render() {
    const { name, description} = this.props.active;

    return (
      <div>
        <div className="bg-white absolute top right mr12 mt24 shadow-darken10 z1 w240">
          <div className="py12 px12">
            <div className='mb6'>
              <h2 className="txt-bold txt-l txt-uppercase block">The Parks</h2> 
            </div>
          </div>
          <div className="py12 px12 bg-gray-faint">
            <div className='mb6'>
              <h2 className="txt-bold txt-m color-gray block">Population</h2>
              <p className='txt-s'>18,866</p>
            </div>
            <div className='mb6'>
              <h2 className="txt-bold txt-m color-gray block">Median Income</h2>
              <p className='txt-s'>$36,131</p>
            </div>
          </div>
          <div className="py12 px12">
            <div className='mb6'>
              <h2 className="txt-bold txt-m block">GDP Growth Potential</h2>
              <p className='txt-s'>1.121</p>
            </div>
            <div className='mb6'>
              <h2 className="txt-bold txt-m block">Job Resilience</h2>
              <p className='txt-s'>3.377</p>
            </div>
            <div className='mb6'>
            <h2 className="txt-bold txt-m block">Business Growth Index</h2>
              <p className='txt-s'>0.2704</p>
            </div>
          </div>
          <div className='py12 px12 bg-blue-light'>
            <div className='mb1'>
            <h2 className="txt-bold txt-m txt-uppercase color-blue inline-block" >Show social bridges</h2>
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
    active: state.active
  };
}

Display = connect(mapStateToProps)(Display);

export default Display;