import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import toast, { ToastBar } from "react-hot-toast";

export function PanicButton() {
  const showEmergencyToast = () => {
    toast.custom((t) => (
      <ToastBar toast={t}>
        {({ icon, message }) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-sm w-full bg-white text-black shadow-lg rounded-lg p-4 flex items-start space-x-3`}
            style={{
              borderLeft: "4px solid #dc2626", // red accent for urgency
            }}
          >
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div className="flex-1 text-sm leading-snug">
              <strong className="block mb-1">🚨 EMERGENCY ALERT ACTIVATED!</strong>
              <span>
                Your location has been shared with:
                <ul className="list-disc list-inside mt-1">
                  <li>Local emergency services</li>
                  <li>Your emergency contacts</li>
                  <li>Tourist helpline</li>
                </ul>
                <strong className="block mt-1">Help is on the way!</strong>
              </span>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="text-black font-bold ml-2">
              ✕
            </button>
          </div>
        )}
      </ToastBar>
    ));
  };

  return (
    <Button
      onClick={showEmergencyToast}
      data-testid="button-panic"
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-lg transition-all transform hover:scale-110 z-50"
      style={{ boxShadow: "0 4px 20px rgba(220, 38, 38, 0.3)" }}
    >
      <AlertTriangle className="h-6 w-6" />
    </Button>
  );
}
