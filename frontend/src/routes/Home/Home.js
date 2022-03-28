import React from 'react'
import { Link } from 'react-router-dom'

import './Home.scss'
import PATH from '../../utils/path'
import AppLogo from 'components/AppLogo'
import Dashboard from '../../components/Dashboard'
import AtlasBreadcrumbs from '../../components/AtlasBreadcrumbs'
import { homeBreadcrumbLink } from '../../components/AtlasBreadcrumbs/AtlasBreadcrumbs'

function Home() {
  return (
    <Dashboard
      sx={{ pt: 0 }}
      headerConfig={{
        noElevateBeforeScroll: true,
        contentScrolled: {
          left: <AtlasBreadcrumbs links={[homeBreadcrumbLink]} />,
        },
      }}>
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
              <Link to={'/explore/small-business-support'}>Small business support</Link>
            </li>
            <li>
              <Link to={'/explore/occupations'}>Occupations</Link>
            </li>
            <li>
              <Link to={'/explore/small-business-support/401011001'}>Small business DATASET_ENTRY</Link>
            </li>
            <li>
              <Link to={'/explore/occupations/dataset'}>Occupations DATASET_ENTRY</Link>
            </li>
            <li>
              <Link to={'/explore/small-business/comparison'}>Small business COMPARISON</Link>
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
    </Dashboard>
  )
}

export default Home
