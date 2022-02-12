// vendors
import React from 'react'
import { Navigate, Route, Routes as Switch } from 'react-router-dom'

// utils
import PATH from '../../../frontend/src/utils/path'

// pages
import Home from './Home'
import Dataset from './Dataset'
import DatasetCompare from './DatasetCompare'
import DatasetEntry from './DatasetEntry'
import GuidedTool from './GuidedTool'
import Contributors from './Contributors'
import Research from './Research'
import Faq from './Faq'
import NotFound from './404'

function Routes() {
  return (
    <Switch>
      {/* root */}
      <Route exact path={PATH.HOME} element={<Home />} />

      {/* dataset */}
      <Route exact path={PATH.COMPARISON} element={<DatasetCompare />} />
      <Route exact path={PATH.DATASET_ENTRY} element={<DatasetEntry />} />
      <Route exact path={PATH.DATASET} element={<Dataset />} />

      {/* tool */}
      <Route exact path={PATH.GUIDED_TOOL} element={<GuidedTool />} />

      {/* static */}
      <Route exact path={PATH.FAQ} element={<Faq />} />
      <Route exact path={PATH.RESEARCH} element={<Research />} />
      <Route exact path={PATH.CONTRIBUTORS} element={<Contributors />} />

      <Route exact path={PATH[404]} element={<NotFound />} />
      <Route path="*" element={<Navigate to={PATH[404]} />} />
    </Switch>
  )
}

export default Routes
