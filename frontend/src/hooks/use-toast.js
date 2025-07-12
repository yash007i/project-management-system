// lib/use-toast.js
import { toast as sonnerToast } from "sonner"

export function toast(props) {
  const { action, ...rest } = props

  const id = sonnerToast({
    ...rest,
    action: action
      ? {
          label: action.label,
          onClick: action.onClick,
        }
      : undefined,
  })

  const dismiss = () => sonnerToast.dismiss(id)

  const update = (newProps) => {
    sonnerToast.dismiss(id)
    sonnerToast({ ...newProps })
  }

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  return {
    toast,
    dismiss: sonnerToast.dismiss,
  }
}
