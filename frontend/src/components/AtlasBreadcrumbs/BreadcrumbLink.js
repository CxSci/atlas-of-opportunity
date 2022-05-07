import React, { useEffect, useRef } from 'react'
import { Link } from '@mui/material'
import classNames from 'classnames'

function BreadcrumbLink({ linkItem, truncate, setWidth = () => null }) {
  const linkRef = useRef()

  useEffect(() => {
    setWidth(linkRef?.current?.offsetWidth)
  }, [linkItem, setWidth])

  return (
    <Link
      ref={linkRef}
      className={classNames('header__link', truncate && `header__link--truncated`)}
      underline={linkItem?.path ? 'hover' : 'none'}
      color="inherit"
      href={linkItem?.path}>
      <span className="header__link__text">{linkItem?.text}</span>

      <span className="header__link__ellipsis">…</span>
    </Link>
  )
}

export default BreadcrumbLink
