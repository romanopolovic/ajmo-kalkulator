import React from "react";
import {
  useCalculatorStore,
  calculateTotals,
} from "../store/useCalculatorStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatCurrency } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Edit2, Play } from "lucide-react";

export default function SavedJobsPage() {
  const { savedEstimates, deleteSavedEstimate, loadEstimate } =
    useCalculatorStore();
  const navigate = useNavigate();

  const handleLoad = (id: string) => {
    loadEstimate(id);
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 pb-20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button
            variant="ghost"
            asChild
            className="text-gray-400 hover:text-white mb-4 -ml-4"
          >
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" /> Natrag na kalkulator
            </Link>
          </Button>
          <h2 className="text-2xl font-semibold tracking-wide text-white mb-2">
            Spremljeni Poslovi
          </h2>
          <p className="text-[13px] text-gray-400">
            Pregled vaših prošlih izračuna spremljenih na ovom uređaju.
          </p>
        </div>
      </div>

      {savedEstimates.length === 0 ? (
        <Card className="p-12 border-white/5 bg-[#1c1c1e] text-center rounded-3xl">
          <h3 className="text-lg font-semibold mb-2">
            Nema spremljenih poslova
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Niste još spremili nijedan izračun.
          </p>
          <Button asChild className="rounded-xl">
            <Link to="/">Novi Izračun</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedEstimates.map((job) => {
            const totals = calculateTotals(job);
            return (
              <Card
                key={job.id}
                className="p-5 border-white/5 bg-[#1c1c1e] rounded-3xl hover:bg-[#2c2c2e] transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {job.clientName || "Nepoznati klijent"}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-mono bg-black/50 px-2 py-1 rounded-md">
                      {job.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-yellow-500">
                      {formatCurrency(totals.total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mb-6 text-[13px]">
                  {job.location?.address && (
                    <div
                      className="text-gray-400 truncate"
                      title={job.location.address}
                    >
                      📍 {job.location.address}
                    </div>
                  )}
                  {job.date && (
                    <div className="text-gray-400">
                      📅 {job.date} {job.startTime ? `u ${job.startTime}` : ""}
                    </div>
                  )}
                  <div className="text-gray-400">
                    🛠 {job.phases.length} usluga (~{totals.totalHours}h)
                  </div>
                </div>

                <div className="flex gap-2 border-t border-white/5 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl h-10 border-white/10 bg-white/5"
                    onClick={() => handleLoad(job.id)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Uredi
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 rounded-xl h-10"
                    asChild
                  >
                    <Link to={`/share/${job.id}`}>
                      <Play className="w-4 h-4 mr-2" />
                      Otvori
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl h-10 w-10"
                    onClick={() => deleteSavedEstimate(job.id)}
                  >
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
