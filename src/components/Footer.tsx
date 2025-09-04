const WHATSAPP_LINK = "https://wa.me/5517988275111?text=Quero%20agendar%20uma%20aula%20experimental";

export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-100 py-10">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          © {new Date().getFullYear()} CT MATEUS PAVANELLO — Todos os direitos reservados
        </p>
        <a
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-xl bg-blue-600 text-white px-4 py-2 font-semibold shadow hover:bg-blue-700 transition-colors"
        >
          Agendar aula experimental
        </a>
      </div>
    </footer>
  );
}
