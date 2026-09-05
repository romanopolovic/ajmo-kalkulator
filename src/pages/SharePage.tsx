import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCalculatorStore, calculateTotals } from '../store/useCalculatorStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { SERVICES } from '../data/services';
import { MapPin, Calendar, Users, Clock, ArrowLeft } from 'lucide-react';

export default function SharePage() {
  const { id } = useParams();
  const estimate = useCalculatorStore(state => state.estimate);
  const totals = calculateTotals(estimate);

  // Fallback if ID doesn't match local state
  const isFound = estimate.id === id;

  if (!isFound) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Posao nije pronađen</h2>
        <p className="text-muted-foreground mb-8">Poveznica je možda istekla ili je neispravna.</p>
        <Button asChild>
          <Link to="/kalkulator">Novi Izračun</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 pb-20">
      <div className="mb-6">
        <Button variant="ghost" asChild className="text-muted-foreground hover:text-white mb-4">
          <Link to="/kalkulator"><ArrowLeft className="w-4 h-4 mr-2" /> Natrag na kalkulator</Link>
        </Button>
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Detalji Posla</h2>
        <p className="text-muted-foreground font-mono bg-dark inline-block px-3 py-1 rounded">#{estimate.id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-4 bg-dark border-border flex flex-col items-center justify-center text-center">
          <Users className="w-8 h-8 text-yellow-500 mb-2" />
          <span className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Radnika</span>
          <span className="text-2xl font-bold">{totals.maxWorkers}</span>
        </Card>
        <Card className="p-4 bg-dark border-border flex flex-col items-center justify-center text-center">
          <Clock className="w-8 h-8 text-yellow-500 mb-2" />
          <span className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Procjena</span>
          <span className="text-2xl font-bold">{totals.totalHours} h</span>
        </Card>
        <Card className="p-4 bg-yellow-500 border-yellow-400 flex flex-col items-center justify-center text-center text-black">
          <span className="text-sm font-bold uppercase tracking-wider mb-1">Ukupno</span>
          <span className="text-3xl font-black">{formatCurrency(totals.total)}</span>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-dark border-border">
          <h3 className="font-bold text-lg mb-4 text-white border-b border-border pb-2">Usluge</h3>
          <div className="space-y-6">
            {totals.calculatedPhases.map((p, i) => (
              <div key={p.phaseId} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-bold text-yellow-500 mr-2">{i + 1}.</span>
                    <span className="font-bold text-lg">{p.serviceName}</span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-white font-bold">{formatCurrency(p.totalPhasePrice)}</div>
                    <div className="text-muted-foreground">~{p.estimatedHours} h</div>
                  </div>
                </div>
                <div className="ml-5 space-y-1">
                  {p.breakdown.map((b, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-400">
                      <span>{b.name} <span className="text-xs text-gray-500">{b.detail}</span></span>
                      <span>{formatCurrency(b.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {(estimate.location.address || estimate.date) && (
          <Card className="p-6 bg-dark border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            {estimate.location.address && (
              <div>
                <h4 className="text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Lokacija</h4>
                <p className="font-medium text-lg">{estimate.location.address}</p>
                {estimate.location.distanceKm > 0 && <p className="text-sm text-muted-foreground mt-1">{estimate.location.distanceKm} km udaljenosti</p>}
                {estimate.location.lat && (
                  <Button variant="outline" size="sm" className="mt-3 text-xs" onClick={() => window.open(`https://maps.google.com/?q=${estimate.location.lat},${estimate.location.lng}`, '_blank')}>
                    Otvori u Google Maps
                  </Button>
                )}
              </div>
            )}
            {estimate.date && (
              <div>
                <h4 className="text-sm text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Termin</h4>
                <p className="font-medium text-lg">{estimate.date} {estimate.startTime && `u ${estimate.startTime}`}</p>
              </div>
            )}
          </Card>
        )}

        {(estimate.clientName || estimate.clientNotes) && (
          <Card className="p-6 bg-dark border-border">
            <h3 className="font-bold text-lg mb-4 text-white border-b border-border pb-2">Informacije</h3>
            {estimate.clientName && (
              <div className="mb-4">
                <span className="text-sm text-muted-foreground block mb-1">Klijent</span>
                <span className="font-medium">{estimate.clientName} {estimate.clientPhone && `(${estimate.clientPhone})`}</span>
              </div>
            )}
            {estimate.clientNotes && (
              <div>
                <span className="text-sm text-muted-foreground block mb-1">Napomena</span>
                <p className="text-sm whitespace-pre-wrap">{estimate.clientNotes}</p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

