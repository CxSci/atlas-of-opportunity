import { createAction } from 'redux-actions'
import * as types from './types'

export const getDatasetList = createAction(types.GET_DATASET_LIST)
export const getDatasetSingle = createAction(types.GET_DATASET_SINGLE)
export const getDatasetDetailData = createAction(types.GET_DATASET_DETAIL_DATA)
