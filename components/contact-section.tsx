import { Phone, MessageCircle } from "lucide-react";
import { local, type Locale, type SiteData } from "@/lib/settings";
import { dictionary } from "@/lib/i18n";
import { Button } from "./ui/button";
export function ContactSection({
  data,
  locale,
}: {
  data: SiteData;
  locale: Locale;
}) {
  const d = dictionary(locale);
  return (
    <div className="contact-content">
      <div>
        <h2>{local(data.contactsTitle, locale)}</h2>
        {local(data.business, locale) && <p>{local(data.business, locale)}</p>}
        {local(data.address, locale) && <p>{local(data.address, locale)}</p>}
        {local(data.hours, locale) && <p>{local(data.hours, locale)}</p>}
        {!data.phone && !data.whatsapp && !local(data.business, locale) && (
          <p>{d.noContacts}</p>
        )}
      </div>
      <div className="contact-actions">
        {data.phone && (
          <Button asChild variant="outline">
            <a href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}>
              <Phone size={18} />
              {data.phone}
            </a>
          </Button>
        )}
        {data.whatsapp && (
          <Button asChild>
            <a
              href={`https://wa.me/${data.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} />
              {d.whatsapp}
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
