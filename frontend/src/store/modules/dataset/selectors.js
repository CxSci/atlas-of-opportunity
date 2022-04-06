import fp from 'lodash/fp'
import { createDataSelector } from '../api'

export const datasetListSelector = createDataSelector('datasetList')
export const datasetSingleSelector = createDataSelector('datasetSingle')
export const datasetDetailDataSelector = createDataSelector('datasetDetailData')
export const datasetGeoJSONSelector = createDataSelector('datasetGeoJSON')

export const createDataSetSelector = type => fp.compose(fp.find(fp.pathEq('id', type)), datasetListSelector)

export const createExploreLayoutSelector = type =>
  fp.compose(fp.defaultTo(null), fp.get('exploreLayout'), createDataSetSelector(type))

export const createDetailLayoutSelector = type =>
  fp.compose(fp.defaultTo(null), fp.get('detailLayout'), createDataSetSelector(type))
