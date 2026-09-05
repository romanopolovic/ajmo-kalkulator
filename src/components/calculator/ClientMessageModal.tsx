import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  useCalculatorStore,
  calculateTotals,
} from "../../store/useCalculatorStore";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  Copy,
  MessageCircle,
  Check,
  Settings2,
  RefreshCw,
  Save,
} from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { SERVICES } from "../../data/services";

type MessageStyle = "standard" | "kratka" | "prijateljska" | "custom";

const defaultTemplate = `Pozdrav {{ime_klijenta}}! 😊

Hvala na upitu! Za navedenu uslugu:

🛠 Usluga: {{usluga}}
📦 Količina: {{kolicina}} {{jedinica}}
👷 Na teren bismo poslali: {{broj_radnika}} radnika
💰 Cijena: {{ukupna_cijena}} €
💶 Obračun: {{cijena_jedinica}} €/{{jedinica}} {{dodatne_usluge}}
⏱ Procijenjeno trajanje: {{trajanje}}

📅 Termin: {{datum}} u {{vrijeme}}
📍 Lokacija: {{lokacija}}
🗺 Točna lokacija: {{google_maps}}
{{putni_trosak}}
{{napomena}}

Ne pružamo vlastiti prijevoz. Pomažemo isključivo s fizičkim radom (nošenje, slaganje, utovar u Vaše vozilo, itd).

Ako Vam navedena cijena i termin odgovaraju, slobodno nam potvrdite pa dogovaramo detalje.

Lijep pozdrav,
AJMO - Fizički poslovi i usluge Karlovac 💪`;

export default function ClientMessageModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const estimate = useCalculatorStore((state) => state.estimate);
  const totals = calculateTotals(estimate);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<MessageStyle>("standard");
  const [messageText, setMessageText] = useState("");

  // Template Editor State
  const [showEditor, setShowEditor] = useState(false);
  const [customTemplate, setCustomTemplate] = useState(() => {
    return localStorage.getItem("rs_custom_template") || defaultTemplate;
  });

  const getMapsUrl = () => {
    if (!estimate.location.lat || !estimate.location.lng) return "";
    return `https://maps.google.com/?q=${estimate.location.lat},${estimate.location.lng}`;
  };

  const parseTemplate = (template: string) => {
    const servicesStr = totals.calculatedPhases
      .map((cp) => cp.serviceName)
      .join(" i ");

    // Extract base pricing strings from phases (e.g., "11 € / m³")
    const pricingDetails = totals.calculatedPhases
      .map((cp) => {
        const baseDetail = cp.breakdown[0]?.detail;
        return baseDetail ? `${baseDetail} za ${cp.serviceName}` : "";
      })
      .filter(Boolean)
      .join(", ");

    // Extract subservices
    const subs = totals.calculatedPhases.flatMap((cp) =>
      cp.breakdown.slice(1).map((b) => b.name),
    );
    const subsStr =
      subs.length > 0 ? `, uz dodatak za ${subs.join(", ").toLowerCase()}` : "";

    let res = template;
    res = res.replace(
      /\{\{ime_klijenta\}\}/g,
      estimate.clientName ? ` ${estimate.clientName}` : "",
    );
    res = res.replace(/\{\{usluga\}\}/g, servicesStr || "rada");
    res = res.replace(
      /\{\{kolicina\}\}/g,
      estimate.phases.map((p) => p.quantity).join(" + ") || "Po dogovoru",
    );
    res = res.replace(
      /\{\{jedinica\}\}/g,
      estimate.phases.map((p) => SERVICES[p.serviceId]?.unit || "").join(" ") ||
        "",
    );
    res = res.replace(/\{\{ukupna_cijena\}\}/g, formatCurrency(totals.total));
    res = res.replace(/\{\{broj_radnika\}\}/g, totals.maxWorkers.toString());
    res = res.replace(/\{\{trajanje\}\}/g, `~${totals.totalHours} h`);
    res = res.replace(/\{\{datum\}\}/g, estimate.date || "po dogovoru");
    res = res.replace(/\{\{vrijeme\}\}/g, estimate.startTime || "po dogovoru");
    res = res.replace(
      /\{\{lokacija\}\}/g,
      estimate.location.address || "Nije uneseno",
    );
    res = res.replace(/\{\{google_maps\}\}/g, getMapsUrl() || "Nije uneseno");
    res = res.replace(
      /\{\{cijena_jedinica\}\}/g,
      pricingDetails || "prema dogovoru",
    );
    res = res.replace(/\{\{dodatne_usluge\}\}/g, subsStr);

    res = res.replace(
      /\{\{putni_trosak\}\}/g,
      totals.travelTotal > 0
        ? `\nPutni trošak: ${formatCurrency(totals.travelTotal)}`
        : "",
    );
    res = res.replace(
      /\{\{napomena\}\}/g,
      estimate.clientNotes ? `\nNapomena: ${estimate.clientNotes}` : "",
    );

    // Clean up double spaces or weird formatting if fields were empty
    res = res.replace(/  +/g, " ");
    res = res.replace(/\n\s*\n\s*\n/g, "\n\n");
    return res;
  };

  const generateMessage = (selectedStyle: MessageStyle) => {
    if (selectedStyle === "custom") {
      return parseTemplate(customTemplate);
    }

    const servicesStr = totals.calculatedPhases
      .map((cp) => cp.serviceName)
      .join(" i ");
    const pricingDetails = totals.calculatedPhases
      .map((cp) =>
        cp.breakdown[0]?.detail
          ? `${cp.breakdown[0].detail} za ${cp.serviceName}`
          : "",
      )
      .filter(Boolean)
      .join(", ");
    const subs = totals.calculatedPhases.flatMap((cp) =>
      cp.breakdown.slice(1).map((b) => b.name),
    );
    const mapsUrl = getMapsUrl();

    let txt = "";

    if (selectedStyle === "kratka") {
      txt = `Pozdrav! Za uslugu ${servicesStr || "koju ste tražili"}, cijena je ${formatCurrency(totals.total)}.\n\n`;
      txt += `Dolaze ${totals.maxWorkers} radnika, procjena je ~${totals.totalHours}h.\n`;
      txt += `Termin: ${estimate.date || "dogovor"} ${estimate.startTime ? `u ${estimate.startTime}` : ""}\n`;
      txt += `Lokacija: ${estimate.location.address || "Nije uneseno"}\n\n`;
      txt += `Napomena: Ne nudimo vlastiti prijevoz, samo fizički rad.\n\n`;
      txt += `Možete li potvrditi termin?\nLp, AJMO`;
    } else if (selectedStyle === "prijateljska") {
      txt = `Bok${estimate.clientName ? ` ${estimate.clientName}` : ""}! 👋\n\n`;
      txt += `Evo kratke procjene za ${servicesStr || "posao"}.\n`;
      txt += `Ukupno bi to izašlo oko ${formatCurrency(totals.total)}.\n\n`;
      txt += `Poslat ćemo ${totals.maxWorkers} dečkiju da to riješe. Cijena je ${pricingDetails || "fiksna"}${subs.length > 0 ? `, a uključili smo i ${subs.join(", ").toLowerCase()}` : ""}.\n`;
      txt += `Trebat će im otprilike ${totals.totalHours} sati.\n\n`;
      txt += `Planirani dolazak: ${estimate.date || "po dogovoru"} ${estimate.startTime ? `u ${estimate.startTime}` : ""}.\n`;
      if (mapsUrl) txt += `Lokacija nam je zabilježena: ${mapsUrl}\n`;
      txt += `\nNapomena: Ekipa dolazi pomoći fizički, ali mi nemamo svoj kombi za prijevoz stvari.\n`;
      txt += `\nJavi ako ti ovo paše pa da upišemo u raspored! 🍻`;
    } else {
      txt = parseTemplate(defaultTemplate);
    }

    return txt.trim();
  };

  useEffect(() => {
    if (open && !showEditor) {
      setMessageText(generateMessage(style));
    }
  }, [open, style, estimate, customTemplate, showEditor]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(messageText);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const saveCustomTemplate = () => {
    localStorage.setItem("rs_custom_template", customTemplate);
    setShowEditor(false);
    setStyle("custom");
    setMessageText(parseTemplate(customTemplate));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-border pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">
                Poruka Klijentu
              </h2>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEditor(!showEditor)}
            className={showEditor ? "text-yellow-500" : "text-muted-foreground"}
          >
            <Settings2 className="w-5 h-5" />
          </Button>
        </div>

        {showEditor ? (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded text-xs text-yellow-200">
              <span className="font-bold">Uređivač predloška</span> - Možete
              koristiti sljedeće varijable:
              <code className="bg-black px-1 mx-1 rounded">
                {"{{ime_klijenta}}"}
              </code>
              <code className="bg-black px-1 mx-1 rounded">{"{{usluga}}"}</code>
              <code className="bg-black px-1 mx-1 rounded">
                {"{{ukupna_cijena}}"}
              </code>
              <code className="bg-black px-1 mx-1 rounded">
                {"{{broj_radnika}}"}
              </code>
              <code className="bg-black px-1 mx-1 rounded">
                {"{{cijena_jedinica}}"}
              </code>
              <code className="bg-black px-1 mx-1 rounded">
                {"{{dodatne_usluge}}"}
              </code>
              <code className="bg-black px-1 mx-1 rounded">
                {"{{trajanje}}"}
              </code>
              <code className="bg-black px-1 mx-1 rounded">{"{{datum}}"}</code>
              <code className="bg-black px-1 mx-1 rounded">
                {"{{lokacija}}"}
              </code>
              <code className="bg-black px-1 mx-1 rounded">
                {"{{google_maps}}"}
              </code>
            </div>
            <Textarea
              className="flex-1 min-h-[300px] font-mono text-sm bg-black border-border resize-none"
              value={customTemplate}
              onChange={(e) => setCustomTemplate(e.target.value)}
            />
            <Button
              onClick={saveCustomTemplate}
              className="w-full bg-yellow-500 text-black hover:bg-yellow-400"
            >
              <Save className="w-4 h-4 mr-2" />
              Spremi Predložak
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4">
            <div className="flex gap-2 bg-black p-1 rounded border border-border">
              {["standard", "kratka", "prijateljska", "custom"].map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s as MessageStyle)}
                  className={`flex-1 text-xs font-bold uppercase py-2 rounded transition-colors ${style === s ? "bg-zinc-800 text-white" : "text-muted-foreground hover:text-white"}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <Textarea
              className="flex-1 min-h-[250px] font-sans text-sm bg-black border-border resize-none leading-relaxed"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3 shrink-0">
              <Button
                className="h-12 bg-green-600 hover:bg-green-500 text-white justify-center"
                onClick={handleWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Otvori WhatsApp
              </Button>

              <Button
                variant="secondary"
                className="h-12 justify-center"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="w-5 h-5 mr-2 text-green-500" />
                ) : (
                  <Copy className="w-5 h-5 mr-2" />
                )}
                {copied ? "Kopirano!" : "Kopiraj Tekst"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
