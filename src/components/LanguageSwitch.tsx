import type { Locale } from '../types';

export function LanguageSwitch({ locale, onChange }: { locale: Locale; onChange: (locale: Locale) => void }) {
  return (
    <div className="language-switch" aria-label="Language">
      {(['zh', 'en', 'de'] as Locale[]).map((item) => (
        <button key={item} className={locale === item ? 'active' : ''} onClick={() => onChange(item)} type="button">{item.toUpperCase()}</button>
      ))}
    </div>
  );
}
