export function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-100 py-10">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">
          © {new Date().getFullYear()} CT MATEUS PAVANELLO — Todos os direitos reservados
        </p>
        <a
          href="https://crmvsystem.com"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          Site desenvolvido por crmvsystem.com
        </a>
      </div>
    </footer>
  );
}
