const cache = {}

export const getDynamicComponent = async (moduleName, componentName) => {
  if (!cache[componentName]) {
    const module = await import(moduleName)
    cache[componentName] = module[componentName]
  }
  return cache[componentName]
}

// Immediate export using a promise resolution pattern
export const createComponent = (moduleName, componentName) => {
  return async props => {
    const Component = await getDynamicComponent(moduleName, componentName)
    return <Component {...props} />
  }
}

export const Text = createComponent('@eitje/web_components', 'Text')
export const Icon = createComponent('@eitje/web_components', 'Icon')
export const PopoutCard = createComponent('@eitje/web_components', 'PopoutCard')
