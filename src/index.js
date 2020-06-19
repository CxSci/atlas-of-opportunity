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

class Application extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Map />
          <Toggle onChange={setActiveOption} />
          <Display />
          <Legend />
        </div>
                         <StickyFooter
            bottomThreshold={50}
            normalStyles={{
            backgroundColor: "#999999",
            padding: "2rem"
            }}
            stickyStyles={{
            backgroundColor: "rgba(255,255,255,.8)",
            padding: "2rem"
            }}
        >
            Add any footer markup here
        </StickyFooter>
      </Provider>
    );
  }
}

ReactDOM.render(<Application />, document.getElementById('app'));
