import AppLogo from 'components/AppLogo'
import './Home.scss'

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
      </header>
    </div>
  )
}

export default Home
