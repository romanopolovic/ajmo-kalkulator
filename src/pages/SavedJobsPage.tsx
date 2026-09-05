import React from 'react';
import { useCalculatorStore, calculateTotals } from '../store/useCalculatorStore';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Play } from 'lucide-react';

export default function SavedJobsPage() {
  const { savedEstimates, deleteSavedEstimate, loadEstimate } = useCalculatorStore();
  const navigate = useNavigate();

  const handleLoad = (id: string) => {
    loadEstimate(id);
    navigate('/kalkulator');
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-white mb-4 -ml-4">
            <Link to="/kalkulator"><ArrowLeft className="w-4 h-4 mr-2" /> Natrag na kalkulator</Link>
          </Button>
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Spremljeni Poslovi</h2>
          <p className="text-muted-foreground">Pregled vaših prošlih izračuna spremljenih na ovom uređaju.</p>
        </div>
      </div>

      {savedEstimates.length === 0 ? (
        <Card className="p-12 border-border bg-dark text-center">
          <h3 className="text-xl font-bold mb-2">Nema spremljenih poslova</h3>
          <p className="text-muted-foreground mb-6">Niste još spremili nijedan izračun.</p>
          <Button asChild>
            <Link to="/kalkulator">Novi Izračun</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedEstimates.map(job => {
            const totals = calculateTotals(job);
            return (
              <Card key={job.id} className="p-5 border-border bg-dark hover:border-yellow-500/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg mb-1">{job.clientName || 'Nepoznati klijent'}</h4>
                    <span className="text-xs text-muted-foreground font-mono bg-black px-2 py-1 rounded">{job.id}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-xl text-yellow-500">{formatCurrency(totals.total)}</span>
                  </div>
                </div>
                
                <div className="space-y-1 mb-6 text-sm">
                  {job.location?.address && <div className="text-muted-foreground truncate" title={job.location.address}>📍 {job.location.address}</div>}
                  {job.date && <div className="text-muted-foreground">📅 {job.date} {job.startTime ? `u ${job.startTime}` : ''}</div>}
                  <div className="text-muted-foreground">🛠 {job.phases.length} usluga (~{totals.totalHours}h)</div>
                </div>
                
                <div className="flex gap-2 border-t border-border pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleLoad(job.id)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Uredi
                  </Button>
                  <Button variant="secondary" className="flex-1" asChild>
                    <Link to={`/posao/${job.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Otvori
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => deleteSavedEstimate(job.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
