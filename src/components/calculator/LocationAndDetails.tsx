import React, { useState } from "react";
import { useCalculatorStore } from "../../store/useCalculatorStore";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  MapPin,
  Calendar,
  Car,
  Tag,
  Plus,
  Trash2,
  Percent,
  Crosshair,
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function LocationAndDetails() {
  const {
    estimate,
    updateEstimate,
    updateLocation,
    addExpense,
    removeExpense,
  } = useCalculatorStore();
  const [newExpName, setNewExpName] = useState("");
  const [newExpAmount, setNewExpAmount] = useState("");
  const [isLocating, setIsLocating] = useState(false);

  const handleAddExpense = () => {
    if (newExpName && newExpAmount) {
      addExpense({
        id: Math.random().toString(),
        name: newExpName,
        amount: parseFloat(newExpAmount),
      });
      setNewExpName("");
      setNewExpAmount("");
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolokacija nije podržana u vašem pregledniku.");
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
          address: "GPS Lokacija zabilježena",
        });
      },
      (error) => {
        setIsLocating(false);
        alert("Greška pri dohvaćanju lokacije: " + error.message);
      },
      { enableHighAccuracy: true },
    );
  };

  return (
    <div className="space-y-6 mt-12">
      <div>
        <h3 className="text-lg font-bold">3. Lokacija, Troškovi i Detalji</h3>
        <p className="text-sm text-muted-foreground">
          Dodatne opcije za točan izračun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl">
          <h4 className="font-semibold tracking-wide flex items-center gap-2 mb-4 text-white">
            <MapPin className="w-5 h-5 text-yellow-500" /> Lokacija
          </h4>
          <div className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Label className="mb-1 block text-gray-400">Adresa posla</Label>
                <Input
                  placeholder="Npr. Radićeva 12, Karlovac"
                  value={estimate.location.address}
                  onChange={(e) => updateLocation({ address: e.target.value })}
                  className="bg-black/50 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
                />
              </div>
              <Button
                variant={estimate.location.lat ? "default" : "outline"}
                size="icon"
                onClick={getLocation}
                disabled={isLocating}
                className={cn(
                  "h-12 w-12 rounded-xl transition-colors",
                  estimate.location.lat
                    ? "bg-green-600 hover:bg-green-700 text-white border-0"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white",
                )}
                title="Koristi GPS"
              >
                <Crosshair
                  className={`w-5 h-5 ${isLocating ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            {estimate.location.lat && (
              <div className="text-[11px] text-green-500 flex items-center gap-1 font-medium bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
                ✓ Precizna GPS lokacija spremljena (±
                {Math.round(estimate.location.accuracy || 0)}m)
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <div className="flex-1">
                <Label className="mb-1 block flex items-center gap-1 text-gray-400">
                  <Car className="w-4 h-4" /> Udaljenost (km)
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={estimate.location.distanceKm || ""}
                  onChange={(e) =>
                    updateLocation({
                      distanceKm: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-black/50 border-white/10 h-12 rounded-xl text-white text-center"
                />
              </div>
              <div className="w-24">
                <Label className="mb-1 block text-gray-400 text-center">
                  Cijena/km
                </Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={estimate.location.travelCostPerKm || ""}
                  onChange={(e) =>
                    updateLocation({
                      travelCostPerKm: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="bg-black/50 border-white/10 h-12 rounded-xl text-white text-center"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl">
          <h4 className="font-semibold tracking-wide flex items-center gap-2 mb-4 text-white">
            <Tag className="w-5 h-5 text-yellow-500" /> Dodatno
          </h4>

          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <Label className="mb-1 block text-gray-400">Naziv troška</Label>
                <Input
                  placeholder="Npr. Odvoz"
                  value={newExpName}
                  onChange={(e) => setNewExpName(e.target.value)}
                  className="bg-black/50 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
                />
              </div>
              <div className="w-24">
                <Label className="mb-1 block text-gray-400">Iznos (€)</Label>
                <Input
                  type="number"
                  placeholder="20"
                  value={newExpAmount}
                  onChange={(e) => setNewExpAmount(e.target.value)}
                  className="bg-black/50 border-white/10 h-12 rounded-xl text-white text-center placeholder:text-gray-600"
                />
              </div>
              <div className="pt-7">
                <Button
                  size="icon"
                  onClick={handleAddExpense}
                  className="h-12 w-12 rounded-xl bg-white/5 border-white/10 hover:bg-white/10 text-white"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {estimate.additionalExpenses.length > 0 && (
              <div className="space-y-2 border border-white/5 p-3 rounded-2xl bg-black/50">
                {estimate.additionalExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex justify-between items-center text-[13px]"
                  >
                    <span className="text-gray-300">{exp.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-white">
                        {exp.amount} €
                      </span>
                      <Trash2
                        className="w-4 h-4 text-red-400 cursor-pointer active:scale-90 transition-transform"
                        onClick={() => removeExpense(exp.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-5 border-t border-white/5 mt-5">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label className="mb-1 block flex items-center gap-1 text-gray-400">
                    <Percent className="w-4 h-4" /> Popust
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={estimate.discountValue || ""}
                    onChange={(e) =>
                      updateEstimate({
                        discountValue: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-black/50 border-white/10 h-12 rounded-xl text-white text-center"
                  />
                </div>
                <div className="w-32">
                  <Label className="mb-1 block text-gray-400 text-center">
                    Vrsta
                  </Label>
                  <select
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/50 px-3 text-sm focus-visible:ring-2 focus-visible:ring-yellow-500 text-white text-center"
                    value={estimate.discountType}
                    onChange={(e) =>
                      updateEstimate({ discountType: e.target.value as any })
                    }
                  >
                    <option
                      value="percentage"
                      className="bg-[#1c1c1e] text-white"
                    >
                      Postotak (%)
                    </option>
                    <option value="fixed" className="bg-[#1c1c1e] text-white">
                      Iznos (€)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl md:col-span-2">
          <div className="flex flex-col gap-4 mb-5 pb-5 border-b border-white/5">
            <h4 className="font-semibold tracking-wide text-white">
              Podaci o klijentu (Opcionalno)
            </h4>
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 flex items-center bg-black/50 border border-white/10 rounded-xl overflow-hidden h-12 px-3">
                <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                <Input
                  type="date"
                  className="h-full border-0 bg-transparent text-white p-0"
                  value={estimate.date || ""}
                  onChange={(e) => updateEstimate({ date: e.target.value })}
                />
              </div>
              <div className="w-32 flex items-center bg-black/50 border border-white/10 rounded-xl overflow-hidden h-12 px-3">
                <Input
                  type="time"
                  className="h-full border-0 bg-transparent text-white p-0 text-center"
                  value={estimate.startTime || ""}
                  onChange={(e) =>
                    updateEstimate({ startTime: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="mb-1 block text-gray-400">Ime i Prezime</Label>
              <Input
                placeholder="Ivan Horvat"
                value={estimate.clientName}
                onChange={(e) => updateEstimate({ clientName: e.target.value })}
                className="bg-black/50 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
              />
            </div>
            <div>
              <Label className="mb-1 block text-gray-400">Telefon</Label>
              <Input
                placeholder="09X XXX XXXX"
                value={estimate.clientPhone}
                onChange={(e) =>
                  updateEstimate({ clientPhone: e.target.value })
                }
                className="bg-black/50 border-white/10 h-12 rounded-xl text-white placeholder:text-gray-600"
              />
            </div>
          </div>
          <div>
            <Label className="mb-1 block text-gray-400">
              Napomena za ekipu
            </Label>
            <Textarea
              placeholder="Npr. Paziti na psa, ulaz sa stražnje strane..."
              value={estimate.clientNotes}
              onChange={(e) => updateEstimate({ clientNotes: e.target.value })}
              className="bg-black/50 border-white/10 rounded-xl min-h-[100px] text-white placeholder:text-gray-600 resize-none"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
