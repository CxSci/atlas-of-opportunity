import fp from 'lodash/fp'

export const getColumns = fp.compose(fp.sortedUniq, fp.union([0, 1]), fp.map(fp.get('column')))
