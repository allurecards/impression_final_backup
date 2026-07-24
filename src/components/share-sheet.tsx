import { useEffect } from "react";
import { Link, Mail, Share2, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productUrl: string;
  productTitle: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MessagesIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 5.817 2 10.5c0 1.88.72 3.605 1.918 4.957.235.323.302.74.18 1.125l-.76 2.41 2.854-.951a1.5 1.5 0 01.998.06A11.236 11.236 0 0012 19.5c3.09 0 5.88-1.144 7.96-3.02.06-.054.122-.108.184-.16A5.29 5.29 0 0022 12.5c0-1.88-.72-3.605-1.918-4.957.018-.01.036-.018.054-.027l-.002-.003A10.73 10.73 0 0012 2z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const shareOptions = [
  { id: "whatsapp", label: "WhatsApp", Icon: WhatsAppIcon },
  { id: "messages", label: "Messages", Icon: MessagesIcon },
  { id: "facebook", label: "Facebook", Icon: FacebookIcon },
  { id: "twitter", label: "X", Icon: XIcon },
  { id: "telegram", label: "Telegram", Icon: TelegramIcon },
  { id: "email", label: "Email", Icon: Mail },
  { id: "copy", label: "Copy Link", Icon: Link },
] as const;

export function ShareSheet({ open, onOpenChange, productUrl, productTitle }: ShareSheetProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  const handleShare = async (id: string) => {
    switch (id) {
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(productUrl)}`, "_blank");
        break;
      case "messages":
        window.location.href = `sms:?body=${encodeURIComponent(productUrl)}`;
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
          "_blank",
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}`,
          "_blank",
        );
        break;
      case "telegram":
        window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}`, "_blank");
        break;
      case "email":
        window.location.href = `mailto:?body=${encodeURIComponent(productUrl)}&subject=${encodeURIComponent(productTitle)}`;
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(productUrl);
          toast.success("Link copied!");
        } catch {
          toast.error("Failed to copy link");
        }
        break;
    }
    onOpenChange(false);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: productTitle, url: productUrl });
      } catch {}
    }
    onOpenChange(false);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[90] flex items-end justify-center transition-all duration-200",
        open ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
      )}
      onClick={() => onOpenChange(false)}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className={cn(
          "relative w-full max-w-lg rounded-t-[20px] bg-zola-cream p-6 pb-8 shadow-2xl transition-all duration-300 dark:bg-neutral-900",
          open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full bg-zola-ink/10 p-1.5 text-zola-ink/60 transition-colors hover:bg-zola-ink/20 dark:bg-white/10 dark:text-zola-cream/60 dark:hover:bg-white/20"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-6 text-center font-serif text-2xl text-zola-ink dark:text-zola-cream">
          Share
        </h2>

        <div className="overflow-x-auto pb-4">
          <div className="flex justify-center gap-5 min-w-max">
            {shareOptions.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => handleShare(id)}
                className="group flex flex-col items-center gap-2"
                aria-label={label}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zola-ink/5 text-zola-ink/80 transition-all duration-200 group-hover:bg-zola-ink/10 group-hover:scale-105 group-active:scale-95 dark:bg-white/10 dark:text-zola-cream/80 dark:group-hover:bg-white/20">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-medium text-zola-ink/60 dark:text-zola-cream/60">
                  {label}
                </span>
              </button>
            ))}

            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                onClick={handleNativeShare}
                className="group flex flex-col items-center gap-2"
                aria-label="More"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-zola-ink/5 text-zola-ink/80 transition-all duration-200 group-hover:bg-zola-ink/10 group-hover:scale-105 group-active:scale-95 dark:bg-white/10 dark:text-zola-cream/80 dark:group-hover:bg-white/20">
                  <Share2 className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-medium text-zola-ink/60 dark:text-zola-cream/60">
                  More
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-zola-ink/15 bg-white px-4 py-2 dark:border-white/15 dark:bg-neutral-800">
          <input
            type="text"
            readOnly
            value={productUrl}
            className="flex-1 bg-transparent text-sm text-zola-ink/80 outline-none dark:text-zola-cream/80"
          />
          <button
            onClick={() => handleShare("copy")}
            className="shrink-0 rounded-lg bg-zola-ink px-4 py-1.5 text-xs font-semibold text-zola-cream transition-colors hover:bg-zola-ink/80 active:scale-[0.97] dark:bg-zola-cream dark:text-zola-ink dark:hover:bg-zola-cream/80"
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}
