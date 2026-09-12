import React, { useState } from "react";
import {
  useCalculatorStore,
  calculateTotals,
} from "../store/useCalculatorStore";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatCurrency, cn } from "../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trash2,
  Edit2,
  Play,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { JobEstimate } from "../types";

export default function SavedJobsPage() {
  const {
    savedEstimates,
    deleteSavedEstimate,
    loadEstimate,
    updateSavedEstimateStatus,
  } = useCalculatorStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "active" | "completed">(
    "active",
  );

  const handleLoad = (id: string) => {
    loadEstimate(id);
    navigate("/");
  };

  const filteredJobs = savedEstimates.filter((job) => {
    if (filter === "active") return job.status !== "completed";
    if (filter === "completed") return job.status === "completed";
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto md:mt-4 pb-20">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-wide text-white mb-2">
            Spremljeni Poslovi
          </h2>
          <p className="text-[13px] text-gray-400">
            Pregled vaših prošlih izračuna spremljenih na ovom uređaju.
          </p>
        </div>

        <div className="flex bg-black/50 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setFilter("active")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
              filter === "active"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300",
            )}
          >
            Aktivni
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
              filter === "completed"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300",
            )}
          >
            Završeni
          </button>
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-1.5 rounded-lg text-[13px] font-medium transition-colors",
              filter === "all"
                ? "bg-white/10 text-white"
                : "text-gray-500 hover:text-gray-300",
            )}
          >
            Svi
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="p-12 border-white/5 bg-[#1c1c1e] text-center rounded-3xl">
          <h3 className="text-lg font-semibold mb-2">
            Nema spremljenih poslova
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Trenutno nema poslova u ovoj kategoriji.
          </p>
          {filter !== "all" && (
            <Button asChild className="rounded-xl">
              <Link to="/">Novi Izračun</Link>
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredJobs.map((job) => {
            const totals = calculateTotals(job);
            const isCompleted = job.status === "completed";

            return (
              <Card
                key={job.id}
                className={cn(
                  "p-5 border-white/5 rounded-3xl transition-colors",
                  isCompleted
                    ? "bg-[#1c1c1e]/50 opacity-80"
                    : "bg-[#1c1c1e] hover:bg-[#2c2c2e]",
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4
                      className={cn(
                        "font-semibold mb-1",
                        isCompleted
                          ? "text-gray-400 line-through"
                          : "text-white",
                      )}
                    >
                      {job.clientName || "Nepoznati klijent"}
                    </h4>
                    <span className="text-[11px] text-gray-500 font-mono bg-black/50 px-2 py-1 rounded-md">
                      {job.id}
                    </span>
                  </div>
                  <div className="text-right">
                    <span
                      className={cn(
                        "font-bold text-lg",
                        isCompleted ? "text-gray-500" : "text-yellow-500",
                      )}
                    >
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
                    variant="ghost"
                    className={cn(
                      "flex-1 rounded-xl h-10 border-white/10",
                      isCompleted
                        ? "text-green-500 bg-green-500/10 hover:bg-green-500/20"
                        : "text-gray-400 bg-white/5 hover:bg-white/10",
                    )}
                    onClick={() =>
                      updateSavedEstimateStatus(
                        job.id,
                        isCompleted ? "draft" : "completed",
                      )
                    }
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                    ) : (
                      <Circle className="w-4 h-4 mr-2" />
                    )}
                    {isCompleted ? "Završeno" : "Označi završenim"}
                  </Button>

                  {!isCompleted && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-xl h-10 w-10 border-white/10 bg-white/5"
                      onClick={() => handleLoad(job.id)}
                      title="Uredi"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-xl h-10 w-10"
                    asChild
                    title="Pregled"
                  >
                    <Link to={`/share/${job.id}`}>
                      <Play className="w-4 h-4" />
                    </Link>
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl h-10 w-10"
                    onClick={() => deleteSavedEstimate(job.id)}
                    title="Obriši"
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
