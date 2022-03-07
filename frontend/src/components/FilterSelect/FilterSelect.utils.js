import fp from 'lodash/fp'

export const getOptions = (filter, data) => fp.compose(fp.uniq, fp.map(fp.get(filter.key)))(data)
