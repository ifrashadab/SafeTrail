// NEW: Toast provider component for in-app notifications
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
  background: '#ffffff',
  color: '#000000',
  border: '1px solid #e5e5e5',
  borderRadius: '0.75rem', // match Tailwind rounded-xl
  fontSize: '14px',
  padding: '12px 16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
},

        success: {
          iconTheme: {
            primary: 'hsl(var(--primary))',
            secondary: 'hsl(var(--primary-foreground))',
          },
        },
        error: {
          iconTheme: {
            primary: 'hsl(var(--destructive))',
            secondary: 'hsl(var(--destructive-foreground))',
          },
        },
      }}
    />
  );
}