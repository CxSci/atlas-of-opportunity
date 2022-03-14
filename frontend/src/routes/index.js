// vendors
import React from 'react'
import { Route, Routes as Switch } from 'react-router-dom'

// utils
import PATH from '../utils/path'

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

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Switch>
  )
}

export default Routes
