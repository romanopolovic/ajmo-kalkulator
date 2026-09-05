import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { useCalculatorStore, calculateTotals } from '../../store/useCalculatorStore';
import { Button } from '../ui/button';
import { Copy, Share2, MessageCircle, FileText, Check, Calendar as CalendarIcon, Map } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { QRCodeSVG } from 'qrcode.react';

export default function JobSummaryModal({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const estimate = useCalculatorStore(state => state.estimate);
  const totals = calculateTotals(estimate);
  const [copied, setCopied] = useState(false);

  const getMapsUrl = (type: 'google' | 'apple') => {
    if (!estimate.location.lat || !estimate.location.lng) return '';
    if (type === 'google') return `https://maps.google.com/?q=${estimate.location.lat},${estimate.location.lng}`;
    if (type === 'apple') return `https://maps.apple.com/?q=${estimate.location.lat},${estimate.location.lng}`;
    return '';
  };

  const getEstimatedEnd = () => {
    if (!estimate.startTime) return '';
    const [h, m] = estimate.startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m, 0, 0);
    date.setMinutes(date.getMinutes() + (totals.totalHours * 60));
    return date.toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' });
  };

  const generateJobText = () => {
    let text = `🚨 NOVI POSAO - AJMO\n\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📋 POSAO #${estimate.id}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n\n`;
    
    if (estimate.date) text += `📅 DATUM: ${estimate.date}\n`;
    if (estimate.startTime) {
      text += `🕘 DOLAZAK: ${estimate.startTime}\n`;
      text += `🏁 ZAVRŠETAK: ~${getEstimatedEnd()} (±30 min)\n`;
    }
    
    text += `\n📍 LOKACIJA:\n${estimate.location.address || 'Nije uneseno'}\n`;
    if (estimate.location.lat) {
      text += `\n🧭 TOČNA LOKACIJA:\nGoogle Maps: ${getMapsUrl('google')}\nApple Maps: ${getMapsUrl('apple')}\n`;
    }

    text += `\n━━━━━━━━━━━━━━━━━━━━\n🛠 POSAO:\n`;
    totals.calculatedPhases.forEach((p, i) => {
      text += `\n${i+1}. ${p.serviceName} (${p.estimatedHours}h, ${estimate.phases[i].workers} radnika)\n`;
      p.breakdown.forEach(b => {
        text += `   - ${b.name}: ${formatCurrency(b.amount)}\n`;
      });
    });

    text += `\n━━━━━━━━━━━━━━━━━━━━\n💰 CIJENA:\n\n`;
    text += `Usluge: ${formatCurrency(totals.phasesTotal)}\n`;
    if (totals.travelTotal > 0) text += `Putni trošak: ${formatCurrency(totals.travelTotal)}\n`;
    if (totals.expensesTotal > 0) text += `Dodatni troškovi: ${formatCurrency(totals.expensesTotal)}\n`;
    if (totals.discountAmount > 0) text += `Popust: -${formatCurrency(totals.discountAmount)}\n`;
    
    text += `\nUKUPNO: ${formatCurrency(totals.total)}\n`;
    
    if (totals.maxWorkers > 0) {
      text += `\n💶 RASPODJELA:\n`;
      const perWorker = totals.total / totals.maxWorkers;
      for (let i = 1; i <= totals.maxWorkers; i++) {
        text += `Radnik ${i}: ${formatCurrency(perWorker)}\n`;
      }
    }

    if (estimate.clientName || estimate.clientPhone || estimate.clientNotes) {
      text += `\n━━━━━━━━━━━━━━━━━━━━\n👤 KLIJENT:\n`;
      if (estimate.clientName) text += `${estimate.clientName}\n`;
      if (estimate.clientPhone) text += `📞 ${estimate.clientPhone}\n`;
      if (estimate.clientNotes) text += `\n📝 NAPOMENA:\n${estimate.clientNotes}\n`;
    }
    
    text += `\n━━━━━━━━━━━━━━━━━━━━\n📌 STATUS: ${estimate.status.toUpperCase()}\n`;
    return text;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateJobText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(generateJobText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };
  
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/posao/${estimate.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AJMO - Posao #${estimate.id}`,
          text: 'Detalji posla',
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link kopiran!');
    }
  };

  const generateICS = () => {
    const formatICSDate = (dateStr: string, timeStr: string) => {
      const date = dateStr ? new Date(dateStr) : new Date();
      if (timeStr) {
        const [h, m] = timeStr.split(':').map(Number);
        date.setHours(h, m, 0, 0);
      }
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const startDate = formatICSDate(estimate.date || '', estimate.startTime || '09:00');
    
    let endDateObj = estimate.date ? new Date(estimate.date) : new Date();
    if (estimate.startTime) {
      const [h, m] = estimate.startTime.split(':').map(Number);
      endDateObj.setHours(h, m, 0, 0);
    } else {
      endDateObj.setHours(9, 0, 0, 0);
    }
    endDateObj.setMinutes(endDateObj.getMinutes() + (totals.totalHours * 60));
    const endDate = endDateObj.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const serviceNames = totals.calculatedPhases.map(p => p.serviceName).join(' + ');

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\n`;
    icsContent += `SUMMARY:AJMO - ${serviceNames}\n`;
    icsContent += `DTSTART:${startDate}\n`;
    icsContent += `DTEND:${endDate}\n`;
    icsContent += `LOCATION:${estimate.location.address || ''}\n`;
    icsContent += `DESCRIPTION:Posao #${estimate.id}\\nKlijent: ${estimate.clientName}\\nKontakt: ${estimate.clientPhone}\\nUkupno: ${formatCurrency(totals.total)}\\n${estimate.location.lat ? 'GPS: ' + getMapsUrl('google') : ''}\n`;
    icsContent += `END:VEVENT\nEND:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `ajmo-posao-${estimate.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-4 mb-6 border-b border-border pb-4">
          <div className="w-12 h-12 bg-yellow-500 rounded flex items-center justify-center">
            <FileText className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Sažetak Posla</h2>
            <p className="text-muted-foreground font-mono">{estimate.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black border border-border p-5 rounded-lg font-mono text-[11px] md:text-xs whitespace-pre-wrap text-gray-300 lg:col-span-2 overflow-y-auto max-h-[500px]">
            {generateJobText()}
          </div>

          <div className="space-y-3">
            <div className="font-bold uppercase text-xs text-muted-foreground mb-2">Akcije</div>
            <Button className="w-full h-12 text-base justify-start" onClick={handleWhatsApp}>
              <MessageCircle className="w-5 h-5 mr-3" />
              WhatsApp Poruka
            </Button>
            
            <Button variant="secondary" className="w-full h-12 text-base justify-start" onClick={handleCopy}>
              {copied ? <Check className="w-5 h-5 mr-3 text-green-500" /> : <Copy className="w-5 h-5 mr-3" />}
              {copied ? 'Kopirano!' : 'Kopiraj Tekst'}
            </Button>
            
            <Button variant="outline" className="w-full h-12 text-base justify-start" onClick={handleShare}>
              <Share2 className="w-5 h-5 mr-3 text-yellow-500" />
              Podijeli Link
            </Button>

            <Button variant="outline" className="w-full h-12 text-base justify-start" onClick={generateICS}>
              <CalendarIcon className="w-5 h-5 mr-3 text-blue-400" />
              Dodaj u Kalendar
            </Button>

            {estimate.location.lat && (
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 text-xs h-10" onClick={() => window.open(getMapsUrl('google'), '_blank')}>
                  <Map className="w-4 h-4 mr-2" /> Google Maps
                </Button>
                <Button variant="outline" className="flex-1 text-xs h-10" onClick={() => window.open(getMapsUrl('apple'), '_blank')}>
                  <Map className="w-4 h-4 mr-2" /> Apple Maps
                </Button>
              </div>
            )}
            
            <div className="border border-border p-6 rounded-lg bg-black flex flex-col items-center justify-center mt-6">
              <span className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-bold">Klijent QR Link</span>
              <div className="bg-white p-2 rounded">
                <QRCodeSVG 
                  value={`${window.location.origin}/posao/${estimate.id}`}
                  size={120}
                  level="Q"
                  fgColor="#000000"
                  bgColor="#FFFFFF"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
