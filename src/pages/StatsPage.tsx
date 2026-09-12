import React from "react";
import {
  useCalculatorStore,
  calculateTotals,
} from "../store/useCalculatorStore";
import { Card } from "../components/ui/card";
import { formatCurrency } from "../lib/utils";
import {
  BarChart3,
  CheckCircle2,
  Circle,
  TrendingUp,
  Users,
} from "lucide-react";
import { SERVICES } from "../data/services";

export default function StatsPage() {
  const { savedEstimates } = useCalculatorStore();

  const totalJobs = savedEstimates.length;
  const completedJobs = savedEstimates.filter((j) => j.status === "completed");
  const activeJobs = savedEstimates.filter((j) => j.status !== "completed");

  let totalRevenue = 0;
  let expectedRevenue = 0;
  let totalHoursCompleted = 0;
  let totalHoursExpected = 0;

  const serviceCount: Record<string, number> = {};

  savedEstimates.forEach((job) => {
    const totals = calculateTotals(job);

    if (job.status === "completed") {
      totalRevenue += totals.total;
      totalHoursCompleted += totals.totalHours;
    } else {
      expectedRevenue += totals.total;
      totalHoursExpected += totals.totalHours;
    }

    job.phases.forEach((p) => {
      serviceCount[p.serviceId] = (serviceCount[p.serviceId] || 0) + 1;
    });
  });

  const popularServices = Object.entries(serviceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => ({
      name: SERVICES[id]?.name || id,
      count,
    }));

  return (
    <div className="max-w-4xl mx-auto md:mt-4 pb-20">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-wide text-white mb-2">
          Statistika
        </h2>
        <p className="text-[13px] text-gray-400">
          Pregled svih spremljenih poslova i zarade na ovom uređaju.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="p-6 border-white/5 bg-[#1c1c1e] rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
          <div className="flex items-center gap-3 mb-4 text-green-500">
            <CheckCircle2 className="w-6 h-6" />
            <h3 className="font-semibold text-white">Završeni Poslovi</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                Ukupna zarada
              </p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                  Broj poslova
                </p>
                <p className="text-xl font-medium text-white">
                  {completedJobs.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                  Ukupno sati
                </p>
                <p className="text-xl font-medium text-white">
                  {totalHoursCompleted} h
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-white/5 bg-[#1c1c1e] rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-500" />
          <div className="flex items-center gap-3 mb-4 text-yellow-500">
            <Circle className="w-6 h-6" />
            <h3 className="font-semibold text-white">Aktivni Poslovi</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                Očekivana zarada
              </p>
              <p className="text-3xl font-bold text-white">
                {formatCurrency(expectedRevenue)}
              </p>
            </div>
            <div className="flex justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                  Broj poslova
                </p>
                <p className="text-xl font-medium text-white">
                  {activeJobs.length}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold mb-1">
                  Očekivani sati
                </p>
                <p className="text-xl font-medium text-white">
                  {totalHoursExpected} h
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 border-white/5 bg-[#1c1c1e] rounded-3xl">
          <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            Najčešće Usluge
          </h3>
          <div className="space-y-4">
            {popularServices.length === 0 ? (
              <p className="text-[13px] text-gray-500">
                Nema podataka za prikaz.
              </p>
            ) : (
              popularServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-white/5 text-[11px] text-gray-400 font-medium">
                      {index + 1}
                    </span>
                    <span className="text-[14px] text-gray-300 font-medium">
                      {service.name}
                    </span>
                  </div>
                  <span className="text-[13px] font-bold text-white bg-white/10 px-3 py-1 rounded-full">
                    {service.count} {service.count === 1 ? "put" : "puta"}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
