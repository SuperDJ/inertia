import { mergeDataIntoQueryString, router, shouldIntercept } from '@inertiajs/core'

export default (node, options = {}) => {
  const [href, data] = hrefAndData(options)
  node.href = href
  options.data = data

  function hrefAndData(options) {
    return mergeDataIntoQueryString(
      options.method || 'get',
      node.href || options.href || '',
      options.data || {},
      options.queryStringArrayFormat || 'brackets',
    )
  }

  function visit(event) {
    if (!node.href) {
      throw new Error('Option "href" is required')
    }

    if (shouldIntercept(event)) {
      event.preventDefault()

      router.visit(node.href, {
        onCancelToken: () => node.dispatchEvent(new CustomEvent('cancel-token', { bubbles: true })),
        onBefore: (visit) => node.dispatchEvent(new CustomEvent('before', { bubbles: true, detail: { visit }})),
        onStart: (visit) => node.dispatchEvent(new CustomEvent('start', { bubbles: true, detail: { visit }})),
        onProgress: (progress) => node.dispatchEvent(new CustomEvent('progress', { bubbles: true, detail: { progress }})),
        onFinish: (visit) => node.dispatchEvent(new CustomEvent('finish', { bubbles: true, detail: { visit }})),
        onCancel: () => node.dispatchEvent(new CustomEvent('cancel', { bubbles: true })),
        onSuccess: (page) => node.dispatchEvent(new CustomEvent('success', { bubbles: true, detail: { page }})),
        onError: (errors) => node.dispatchEvent(new CustomEvent('error', { bubbles: true, detail: { errors }})),
        ...options,
      })
    }
  }

  node.addEventListener('click', visit)

  return {
    update(newOptions) {
      const [href, data] = hrefAndData(newOptions)
      node.href = href
      options = { ...newOptions, data }
    },
    destroy() {
      node.removeEventListener('click', visit)
    },
  }
}
