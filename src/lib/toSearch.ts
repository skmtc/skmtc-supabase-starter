export const toSearch = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      search.set(key, value)
    }
  })

  return search.size > 0 ? `?${search.toString()}` : ''
}
