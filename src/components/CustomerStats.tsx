"use client";

import { Stat } from "@/types/interface";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function CustomerStats({ stats, title = "Perkembangan Customer" }: { stats: Stat[], title?: string }) {
  return (
    <div>
      {/* JUDUL */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>

      {/* GRID CARD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map((stat, i) => {
          const isPositive = stat.change && stat.change.startsWith("+");

          return (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition"
            >
              {/* Title */}
              <p className="text-sm text-gray-500">{stat.title}</p>

              {/* Value + Change */}
              <div className="flex items-end justify-between mt-1">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>

                {stat.change && (
                  <span
                    className={`flex items-center text-sm font-medium ${
                      stat.changeColor ??
                      (isPositive ? "text-green-500" : "text-red-500")
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 mr-1" />
                    )}
                    {stat.change}
                  </span>
                )}
              </div>

              {/* Target */}
              {stat.target && (
                <p className="text-xs text-gray-400 mt-2">
                  Target:{" "}
                  {stat.target instanceof Date
                    ? stat.target.toLocaleDateString()
                    : stat.target}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
