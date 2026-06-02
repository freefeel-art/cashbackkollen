export default function GuiderPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Guider</h1>

      <p className="text-xl mb-8">
        Här hittar du guider om cashback, affiliate-marknadsföring och hur cashback-tjänster fungerar i praktiken.
      </p>

      <p className="mb-8">
        Målet är att förklara hur systemen fungerar, vilka faktorer som påverkar cashback och vilka vanliga missförstånd som finns kring cashback-tjänster.
      </p>

      <h2 className="text-2xl font-semibold mb-4">Guider</h2>

      <ul className="space-y-6">
        <li>
          <a href="/guider/vad-ar-cashback" className="underline font-medium">
            Vad är cashback?
          </a>
          <p>
            Lär dig grunderna bakom cashback och hur återbäring fungerar.
          </p>
        </li>

        <li>
          <a href="/guider/hur-fungerar-cashback" className="underline font-medium">
            Hur fungerar cashback?
          </a>
          <p>
            En genomgång av spårning, affiliatelänkar, provisioner och cashback-processen.
          </p>
        </li>

        <li>
          <a href="/guider/ar-cashback-sakert" className="underline font-medium">
            Är cashback säkert?
          </a>
          <p>
            Säkerhet, risker och vanliga missförstånd kring cashback-tjänster.
          </p>
        </li>

        <li>
          <a href="/guider/hur-tjanar-cashback-sidor-pengar" className="underline font-medium">
            Hur tjänar cashback-sidor pengar?
          </a>
          <p>
            En förklaring av affärsmodellen bakom cashback och affiliate-marknadsföring.
          </p>
        </li>

        <li>
          <a href="/guider/varfor-registreras-inte-min-cashback" className="underline font-medium">
            Varför registreras inte min cashback?
          </a>
          <p>
            Vanliga orsaker till utebliven cashback och hur du minskar risken för problem.
          </p>
        </li>
      </ul>
    </main>
  );
}
