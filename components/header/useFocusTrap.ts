import { useEffect } from "react"

export function useFocusTrap(open: boolean, containerRef: { current: HTMLElement | null }, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const container = containerRef.current
    if (!container) return

    const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    const nodes = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter((el) => el.offsetParent !== null)
    const first = nodes[0]
    const last = nodes[nodes.length - 1]

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'Tab') {
        if (nodes.length === 0) {
          e.preventDefault()
          return
        }
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    // set focus to first element
    setTimeout(() => first?.focus(), 0)
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, containerRef, onClose])
}
