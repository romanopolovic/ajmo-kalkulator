import React, { useState } from 'react';
import { useCalculatorStore } from '../../store/useCalculatorStore';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { MapPin, Calendar, Car, Tag, Plus, Trash2, Percent, Crosshair } from 'lucide-react';

export default function LocationAndDetails() {
  const { estimate, updateEstimate, updateLocation, addExpense, removeExpense } = useCalculatorStore();
  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const handleAddExpense = () => {
    if (newExpName && newExpAmount) {
      addExpense({
        id: Math.random().toString(),
        name: newExpName,
        amount: parseFloat(newExpAmount)
      });
      setNewExpName('');
      setNewExpAmount('');
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolokacija nije podržana u vašem pregledniku.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        updateLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          address: 'GPS Lokacija zabilježena'
        });
      },
      (error) => {
        setIsLocating(false);
        alert('Greška pri dohvaćanju lokacije: ' + error.message);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-6 mt-12">
      <div>
        <h3 className="text-lg font-bold">3. Lokacija, Troškovi i Detalji</h3>
        <p className="text-sm text-muted-foreground">Dodatne opcije za točan izračun.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border-border bg-dark">
          <h4 className="font-bold flex items-center gap-2 mb-4"><MapPin className="w-5 h-5 text-yellow-500"/> Lokacija</h4>
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="mb-1 block">Adresa posla</Label>
                <Input 
                  placeholder="Npr. Radićeva 12, Karlovac" 
                  value={estimate.location.address}
                  onChange={(e) => updateLocation({ address: e.target.value })}
                />
              </div>
              <Button 
                variant={estimate.location.lat ? "default" : "outline"}
                size="icon" 
                onClick={getLocation} 
                disabled={isLocating}
                className={estimate.location.lat ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                title="Koristi GPS"
              >
                <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {estimate.location.lat && (
              <div className="text-xs text-green-500 flex items-center gap-1">
                ✓ Precizna GPS lokacija spremljena (Točnost: ±{Math.round(estimate.location.accuracy || 0)}m)
              </div>
            )}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="mb-1 block flex items-center gap-1"><Car className="w-4 h-4"/> Udaljenost (km)</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={estimate.location.distanceKm || ''}
                  onChange={(e) => updateLocation({ distanceKm: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="w-24">
                <Label className="mb-1 block">Cijena/km</Label>
                <Input 
                  type="number" 
                  min="0" step="0.1"
                  value={estimate.location.travelCostPerKm || ''}
                  onChange={(e) => updateLocation({ travelCostPerKm: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border bg-dark">
          <h4 className="font-bold flex items-center gap-2 mb-4"><Tag className="w-5 h-5 text-yellow-500"/> Dodatno</h4>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="mb-1 block">Naziv troška</Label>
                <Input placeholder="Npr. Odvoz" value={newExpName} onChange={e => setNewExpName(e.target.value)} />
              </div>
              <div className="w-24">
                <Label className="mb-1 block">Iznos (€)</Label>
                <Input type="number" placeholder="20" value={newExpAmount} onChange={e => setNewExpAmount(e.target.value)} />
              </div>
              <div className="pt-6">
                <Button size="icon" onClick={handleAddExpense}><Plus className="w-4 h-4"/></Button>
              </div>
            </div>
            
            {estimate.additionalExpenses.length > 0 && (
              <div className="space-y-2 border border-border p-3 rounded bg-black">
                {estimate.additionalExpenses.map(exp => (
                  <div key={exp.id} className="flex justify-between items-center text-sm">
                    <span>{exp.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-bold">{exp.amount} €</span>
                      <Trash2 className="w-4 h-4 text-destructive cursor-pointer hover:opacity-80" onClick={() => removeExpense(exp.id)} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="pt-4 border-t border-border mt-4">
               <div className="flex gap-4">
                  <div className="flex-1">
                    <Label className="mb-1 block flex items-center gap-1"><Percent className="w-4 h-4"/> Popust</Label>
                    <Input 
                      type="number" 
                      min="0"
                      placeholder="0"
                      value={estimate.discountValue || ''}
                      onChange={(e) => updateEstimate({ discountValue: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div className="w-32">
                    <Label className="mb-1 block">Vrsta</Label>
                    <select 
                      className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-yellow-500"
                      value={estimate.discountType}
                      onChange={(e) => updateEstimate({ discountType: e.target.value as any })}
                    >
                      <option value="percentage" className="bg-dark text-white">Postotak (%)</option>
                      <option value="fixed" className="bg-dark text-white">Iznos (€)</option>
                    </select>
                  </div>
               </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-border bg-dark md:col-span-2">
          <div className="flex items-center justify-between mb-4">
             <h4 className="font-bold">Podaci o klijentu (Opcionalno)</h4>
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4"/>
                  <Input type="date" className="h-8 py-1" value={estimate.date || ''} onChange={e => updateEstimate({ date: e.target.value })}/>
               </div>
               <div className="flex items-center gap-2 text-sm">
                  <Input type="time" className="h-8 py-1" value={estimate.startTime || ''} onChange={e => updateEstimate({ startTime: e.target.value })}/>
               </div>
             </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="mb-1 block">Ime i Prezime</Label>
              <Input 
                placeholder="Ivan Horvat"
                value={estimate.clientName}
                onChange={(e) => updateEstimate({ clientName: e.target.value })}
              />
            </div>
            <div>
              <Label className="mb-1 block">Telefon</Label>
              <Input 
                placeholder="09X XXX XXXX"
                value={estimate.clientPhone}
                onChange={(e) => updateEstimate({ clientPhone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="mb-1 block">Napomena za ekipu</Label>
            <Textarea 
              placeholder="Npr. Paziti na psa, ulaz sa stražnje strane..."
              value={estimate.clientNotes}
              onChange={(e) => updateEstimate({ clientNotes: e.target.value })}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

