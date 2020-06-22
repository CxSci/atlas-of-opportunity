import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux';
import { store } from './redux/store'
import { setActiveOption } from './redux/action-creators'
import Map from './components/map'
import Toggle from './components/toggle'
import Display from './components/display'
import Legend from './components/legend'
import StickyFooter from 'react-sticky-footer'
import Footer from './Footer/Footer.js'

class Application extends React.Component {
  render() {
    const mapStyle = {
      zIndex: 0,
    };
    const footerStyle = {
      zIndex: 1,
      position: 'absolute',
      bottom: '0px'
    }
    return (
      <Provider store={store} >
        <div style = {mapStyle}>
          <Map />
          <Toggle onChange={setActiveOption} />
          <Display />
          <Legend />
        </div>
        <div style={footerStyle}>
                         <StickyFooter
            bottomThreshold={50}
            normalStyles={{
            backgroundColor: "rgba(153, 153, 153, 0)",
            padding: "0.5rem"
            }}
            stickyStyles={{
            backgroundColor: "rgba(255,255,255,.8)",
            padding: "2rem",
            }}
            
        >
            <Footer />
        </StickyFooter>
        </div>
      </Provider>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
