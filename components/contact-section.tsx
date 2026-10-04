import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { local, type Locale, type SiteData } from "@/lib/settings";
import { dictionary } from "@/lib/i18n";
import { googleMapsUrl, mapsQuery } from "@/lib/maps";
import { Button } from "./ui/button";
export function ContactSection({
  data,
  locale,
}: {
  data: SiteData;
  locale: Locale;
}) {
  const d = dictionary(locale);
  const address = local(data.address, locale);
  const mapsLink = googleMapsUrl(address);
  return (
    <div className="contact-content">
      <div className="contact-info">
        <p className="contact-kicker">{locale === "az" ? "BİZİMLƏ ƏLAQƏ" : "СВЯЗАТЬСЯ С НАМИ"}</p>
        <h2>{local(data.contactsTitle, locale)}</h2>
        {local(data.business, locale) && <p>{local(data.business, locale)}</p>}
        {address && (
          <div className="contact-detail">
            <span className="contact-detail-icon"><MapPin size={20} strokeWidth={1.8} /></span>
            <div>
              <span className="contact-detail-label">{locale === "az" ? "Ünvan" : "Адрес"}</span>
              <a href={mapsLink} target="_blank" rel="noopener noreferrer">{address}</a>
            </div>
          </div>
        )}
        {data.phone && (
          <div className="contact-detail">
            <span className="contact-detail-icon"><Phone size={19} strokeWidth={1.8} /></span>
            <div>
              <span className="contact-detail-label">{locale === "az" ? "Telefon" : "Телефон"}</span>
              <a href={`tel:${data.phone.replace(/[^+\d]/g, "")}`}>{data.phone}</a>
            </div>
          </div>
        )}
        {local(data.hours, locale) && <p>{local(data.hours, locale)}</p>}
        {!data.phone && !data.whatsapp && !address && !local(data.business, locale) && (
          <p>{d.noContacts}</p>
        )}
        {data.whatsapp && (
          <div className="contact-actions">
            <Button asChild>
              <a href={`https://wa.me/${data.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={18} />{d.whatsapp}
              </a>
            </Button>
          </div>
        )}
      </div>
      {address && (
        <div className="contact-map">
          <iframe
            title={locale === "az" ? "Xəritədə ünvan" : "Адрес на карте"}
            src={`https://maps.google.com/maps?q=${mapsQuery(address)}&z=16&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a href={mapsLink} target="_blank" rel="noopener noreferrer">
            {locale === "az" ? "Google Maps-də aç" : "Открыть в Google Maps"}
            <ArrowUpRight size={17} />
          </a>
        </div>
      )}
    </div>
  );
}
