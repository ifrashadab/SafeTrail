import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast
            key={id}
            {...props}
            className="
              bg-white 
              text-black 
              border border-neutral-300 
              shadow-lg 
              rounded-xl 
              p-4
              transition-all
              hover:shadow-xl
            "
          >
            <div className="grid gap-1">
              {title && (
                <ToastTitle className="text-lg font-semibold text-black">
                  {title}
                </ToastTitle>
              )}
              {description && (
                <ToastDescription className="text-sm text-neutral-700">
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-neutral-500 hover:text-black" />
          </Toast>
        )
      })}
      <ToastViewport
        className="
          fixed top-4 right-4
          flex flex-col gap-3
          max-w-sm
          z-[100]
        "
      />
    </ToastProvider>
  )
}
