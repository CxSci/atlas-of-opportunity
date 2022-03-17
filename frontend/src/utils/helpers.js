import fp from 'lodash/fp'

export const slugify = text =>
  text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')

export const prettifyMethod = fp.toLower

export const deepSetWith = (state, path, data) => {
  if (!path) {
    return data
  }
  const pathArray = path.split('.')
  const [firstKey, ...remaining] = pathArray

  return {
    ...state,
    [firstKey]: deepSetWith(state[firstKey], remaining.join('.'), data),
  }
}

export const deepUnsetWith = (state, path) => {
  if (!path || typeof state !== 'object') {
    return state
  }

  const pathArray = path.split('.')
  const [firstKey, ...remaining] = pathArray

  if (remaining.length === 0) {
    delete state[firstKey]
    return { ...state }
  }
  const newSubState = deepUnsetWith(state[firstKey], remaining.join('.'))
  if (state[firstKey] !== newSubState) {
    return {
      ...state,
      [firstKey]: deepUnsetWith(state[firstKey], remaining.join('.')),
    }
  } else {
    return state
  }
}
