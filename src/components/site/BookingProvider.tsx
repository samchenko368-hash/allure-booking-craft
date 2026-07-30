import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookingForm } from "./BookingForm";
import { useI18n } from "@/lib/i18n";
import type { BookingSource } from "@/types/cms";

interface BookingCtx {
  open: (opts?: { serviceLabel?: string; source?: BookingSource }) => void;
}

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [serviceLabel, setServiceLabel] = useState<string | undefined>();
  const [source, setSource] = useState<BookingSource>("website_form");

  const open = useCallback((opts?: { serviceLabel?: string; source?: BookingSource }) => {
    setServiceLabel(opts?.serviceLabel);
    setSource(opts?.source ?? "website_form");
    setIsOpen(true);
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{t("booking.title")}</DialogTitle>
          </DialogHeader>
          <BookingForm
            source={source}
            defaultService={serviceLabel}
            onDone={() => setTimeout(() => setIsOpen(false), 2200)}
          />
        </DialogContent>
      </Dialog>
    </Ctx.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
