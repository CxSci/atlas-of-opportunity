import AppLogo from 'components/AppLogo'
import { Link } from 'react-router-dom'
import './Home.scss'
import PATH from '../../utils/path'

function Home() {
  return (
    <div className="Home">
      <header className="Home__header">
        <AppLogo />

        <p>
          Edit <code>codebase</code> and save to reload.
        </p>

        <a className="Home__link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React
        </a>

        <p>Temp router links</p>

        <ul>
          <li>
            <Link to={PATH.DATASET.replace(':', '1')}>DATASET</Link>
          </li>
          <li>
            <Link to={PATH.DATASET_ENTRY.replace(':', '1')}>DATASET_ENTRY</Link>
          </li>
          <li>
            <Link to={PATH.COMPARISON.replace(':', '1')}>COMPARISON</Link>
          </li>
          <li>
            <Link to={PATH.GUIDED_TOOL.replace(':', '1')}>GUIDED_TOOL</Link>
          </li>
          <li>
            <Link to={PATH.FAQ}>FAQ</Link>
          </li>
          <li>
            <Link to={PATH.RESEARCH}>RESEARCH</Link>
          </li>
          <li>
            <Link to={PATH.CONTRIBUTORS}>CONTRIBUTORS</Link>
          </li>
        </ul>
      </header>
    </div>
  )
}

export default Home
