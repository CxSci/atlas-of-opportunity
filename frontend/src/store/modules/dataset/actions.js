import { createAction } from 'redux-actions'
import * as types from './types'

export const getDatasetList = createAction(types.GET_DATASET_LIST)
export const getDatasetSingle = createAction(types.GET_DATASET_SINGLE)
export const getDatasetDetailData = createAction(types.GET_DATASET_DETAIL_DATA)
export const getDatasetGeoJSON = createAction(types.GET_DATASET_GEO_JSON)
export const getDatasetMapData = createAction(types.GET_DATASET_MAP_DATA)
