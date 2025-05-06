import React, {lazy, Suspense} from 'react'

const loadable = importFunc => {
  const LazyComponent = lazy(importFunc)

  return props => (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

export const Icon = loadable(() => import('@eitje/web_components').then(module => ({default: module.Icon})))
export const PopoutCard = loadable(() => import('@eitje/web_components').then(module => ({default: module.PopoutCard})))
