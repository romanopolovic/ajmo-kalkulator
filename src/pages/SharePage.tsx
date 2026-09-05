import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  useCalculatorStore,
  calculateTotals,
} from "../store/useCalculatorStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatCurrency } from "../lib/utils";
import { SERVICES } from "../data/services";
import { MapPin, Calendar, Users, Clock, ArrowLeft } from "lucide-react";

export default function SharePage() {
  const { id } = useParams();
  const estimate = useCalculatorStore((state) => state.estimate);
  const totals = calculateTotals(estimate);

  // Fallback if ID doesn't match local state
  const isFound = estimate.id === id;

  if (!isFound) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">
          Posao nije pronađen
        </h2>
        <p className="text-muted-foreground mb-8">
          Poveznica je možda istekla ili je neispravna.
        </p>
        <Button asChild>
          <Link to="/">Novi Izračun</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 pb-20">
      <div className="mb-6">
        <Button
          variant="ghost"
          asChild
          className="text-muted-foreground hover:text-white mb-4"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Natrag na kalkulator
          </Link>
        </Button>
        <h2 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">
          Detalji Posla
        </h2>
        <p className="text-muted-foreground font-mono bg-dark inline-block px-3 py-1 rounded">
          #{estimate.id}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-white/5 bg-[#1c1c1e] rounded-3xl flex flex-col items-center justify-center text-center h-28">
          <Users className="w-6 h-6 text-yellow-500 mb-2" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
            Radnika
          </span>
          <span className="text-2xl font-semibold text-white">
            {totals.maxWorkers}
          </span>
        </Card>
        <Card className="p-4 border-white/5 bg-[#1c1c1e] rounded-3xl flex flex-col items-center justify-center text-center h-28">
          <Clock className="w-6 h-6 text-yellow-500 mb-2" />
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
            Procjena
          </span>
          <span className="text-2xl font-semibold text-white">
            {totals.totalHours} h
          </span>
        </Card>
        <Card className="p-4 bg-yellow-500 border-none rounded-3xl flex flex-col items-center justify-center text-center text-black h-28 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
          <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-80">
            Ukupno
          </span>
          <span className="text-3xl font-bold tracking-tight">
            {formatCurrency(totals.total)}
          </span>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl">
          <h3 className="font-semibold text-[17px] mb-4 text-white border-b border-white/5 pb-3">
            Usluge
          </h3>
          <div className="space-y-5">
            {totals.calculatedPhases.map((p, i) => (
              <div
                key={p.phaseId}
                className="border-b border-white/5 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <span className="font-semibold text-yellow-500 mr-2 bg-yellow-500/10 w-6 h-6 flex items-center justify-center rounded-full text-xs">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-white text-[15px]">
                      {p.serviceName}
                    </span>
                  </div>
                  <div className="text-right text-sm">
                    <div className="text-white font-semibold">
                      {formatCurrency(p.totalPhasePrice)}
                    </div>
                    <div className="text-gray-400 text-[11px] font-medium mt-0.5">
                      ~{p.estimatedHours} h
                    </div>
                  </div>
                </div>
                <div className="ml-8 space-y-1 mt-3">
                  {p.breakdown.map((b, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-[13px] text-gray-400"
                    >
                      <span className="pr-2">
                        {b.name}{" "}
                        <span className="text-[11px] text-gray-500 ml-1">
                          {b.detail}
                        </span>
                      </span>
                      <span className="whitespace-nowrap font-medium text-gray-300">
                        {formatCurrency(b.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {(estimate.location.address || estimate.date) && (
          <Card className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl grid grid-cols-1 gap-5">
            {estimate.location.address && (
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                <h4 className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-yellow-500" /> Lokacija
                </h4>
                <p className="font-semibold text-white text-[15px]">
                  {estimate.location.address}
                </p>
                {estimate.location.distanceKm > 0 && (
                  <p className="text-[13px] text-gray-400 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
                    {estimate.location.distanceKm} km udaljenosti
                  </p>
                )}
                {estimate.location.lat && (
                  <Button
                    variant="secondary"
                    className="mt-3 w-full rounded-xl text-[13px] font-semibold h-10 bg-white/5 hover:bg-white/10 text-white border-0"
                    onClick={() =>
                      window.open(
                        `https://maps.google.com/?q=${estimate.location.lat},${estimate.location.lng}`,
                        "_blank",
                      )
                    }
                  >
                    Otvori u Google Maps
                  </Button>
                )}
              </div>
            )}
            {estimate.date && (
              <div className="bg-black/30 p-4 rounded-2xl border border-white/5">
                <h4 className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-yellow-500" /> Termin
                </h4>
                <p className="font-semibold text-white text-[15px]">
                  {estimate.date}
                </p>
                {estimate.startTime && (
                  <p className="text-[13px] text-gray-400 mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                    u {estimate.startTime}
                  </p>
                )}
              </div>
            )}
          </Card>
        )}

        {(estimate.clientName || estimate.clientNotes) && (
          <Card className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl">
            <h3 className="font-semibold text-[17px] mb-4 text-white border-b border-white/5 pb-3">
              Informacije
            </h3>
            {estimate.clientName && (
              <div className="mb-4">
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest block mb-1">
                  Klijent
                </span>
                <span className="font-semibold text-white text-[15px]">
                  {estimate.clientName}
                </span>
                {estimate.clientPhone && (
                  <span className="text-gray-400 text-[13px] block mt-0.5">
                    {estimate.clientPhone}
                  </span>
                )}
              </div>
            )}
            {estimate.clientNotes && (
              <div>
                <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest block mb-1">
                  Napomena
                </span>
                <p className="text-[14px] leading-relaxed text-gray-300 bg-black/30 p-4 rounded-2xl border border-white/5 mt-2">
                  {estimate.clientNotes}
                </p>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
