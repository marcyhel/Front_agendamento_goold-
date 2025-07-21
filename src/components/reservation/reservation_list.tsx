"use client";

import React, { useState } from "react";
import { ReservationModel } from "@/core/models/reservation.model";
import { ptBR } from "date-fns/locale";
import { formatInTimeZone } from "date-fns-tz";
import Image from "next/image";
import { Button } from "../ui/button";
import { Check, X, ChevronUp, ChevronDown } from "lucide-react";
import { cancelReservationAction, confirmReservationAction } from "@/components/reservation/reservation_action";
import { toast } from "sonner";

interface ReservationListProps {
  reservations: ReservationModel[];
  isLoading?: boolean;
  isAdmin: boolean;
  onReservationUpdate: (
    reservationId: string,
    newStatus: "confirmed" | "cancelled"
  ) => void;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
  onSortChange: (sortBy: string, sortOrder: "ASC" | "DESC") => void;
}

const statusMap = {
  pending: {
    label: "Pendente",
    className: "bg-[#F5F5F5] text-[#676767] border border-[#A4AAAD]",
    backgroundColor: "#ffff",
  },
  confirmed: {
    label: "Agendado",
    className: "bg-[#DBFFFA] text-[#10C3A9] border border-[#10C3A9]",
    backgroundColor: "#EFFFFA",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-[#FFF5F5] text-[#EA0000] border border-[#FF0000]",
    backgroundColor: "#FFF5F5",
  },
};

export function ReservationList({
  reservations,
  isLoading = false,
  isAdmin = false,
  onReservationUpdate,
  sortBy,
  sortOrder,
  onSortChange,
}: ReservationListProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>(
    {}
  );

  const handleDateSortClick = () => {
    if (sortBy === "date") {
      const newOrder = sortOrder === "ASC" ? "DESC" : "ASC";
      onSortChange("date", newOrder);
    } else {
      onSortChange("date", "ASC");
    }
  };

  const renderSortIcon = () => {
    if (sortBy !== "date") return null;

    return sortOrder === "ASC" ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  const handleCancelReservation = async (reservationId: string) => {
    setLoadingActions((prev) => ({ ...prev, [`cancel-${reservationId}`]: true }));

    try {
      const result = await cancelReservationAction(reservationId);

      if (result.success && result.status) {
        onReservationUpdate(reservationId, result.status);
        toast.message("Agendamento cancelado com sucesso!");
      } else {
        toast.message(result.error || "Erro ao cancelar agendamento");
      }
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      toast.message("Erro inesperado ao cancelar agendamento");
    } finally {
      setLoadingActions((prev) => ({
        ...prev,
        [`cancel-${reservationId}`]: false,
      }));
    }
  };

  const handleConfirmReservation = async (reservationId: string) => {
    setLoadingActions((prev) => ({ ...prev, [`confirm-${reservationId}`]: true }));

    try {
      const result = await confirmReservationAction(reservationId);

      if (result.success && result.status) {
        onReservationUpdate(reservationId, result.status);
        toast.message("Agendamento confirmado com sucesso!");
      } else {
        toast.message(result.error || "Erro ao confirmar agendamento");
      }
    } catch (error) {
      console.error("Erro ao confirmar agendamento:", error);
      toast.message("Erro inesperado ao confirmar agendamento");
    } finally {
      setLoadingActions((prev) => ({
        ...prev,
        [`confirm-${reservationId}`]: false,
      }));
    }
  };
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md border p-6">
        <div className="animate-pulse">

          <div className="flex items-center border-b pb-4 mb-4 space-x-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-gray-300 rounded w-1/5"></div>
            ))}
          </div>


          <div className="space-y-4">
            {[...Array(8)].map((_, rowIdx) => (
              <div key={rowIdx} className="flex items-center space-x-6">
                {[...Array(5)].map((_, colIdx) => (
                  <div
                    key={colIdx}
                    className="h-4 bg-gray-200 rounded w-1/5"
                  ></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col w-full h-full items-center justify-center">
        <Image
          aria-hidden
          src="/wipe.png"
          alt="File icon"
          width={300}
          height={300}
          className="mb-8"
        />
        <p className="text-black text-[22px] font-semibold">
          Nada por aqui ainda ...
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="min-w-full">
          <thead className="bg-white sticky top-0 z-10 border-b border-[#D7D7D7] ">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                <button
                  onClick={handleDateSortClick}
                  className="flex items-center hover:text-gray-600 transition-colors cursor-pointer"
                  disabled={isLoading}
                >
                  Data agendamento
                  {renderSortIcon()}
                </button>
              </th>
              <th className="px-6 py-3 w-1/3 text-left text-xs font-medium text-black">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Sala de agendamento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Status transação
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black">
                Ação
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D7D7D7]">
            {reservations.map((reservation) => {
              const status = statusMap[reservation.status];
              return (
                <tr key={reservation.id} style={{ backgroundColor: status.backgroundColor }}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex gap-2 text-[14px] text-black font-normal">
                      <div className="">
                        {formatInTimeZone(
                          new Date(reservation.date),
                          "UTC",
                          "dd/MM/yyyy",
                          {
                            locale: ptBR,
                          }
                        )}
                      </div>
                      <div>às {reservation.time}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-black font-medium text-[14px]">
                      {reservation.user.name} {reservation.user.lastName}
                    </p>
                    <p className="text-black font-normal text-[13px]">
                      {reservation.user.role === "admin"
                        ? "Administrador"
                        : "Usuário"}
                    </p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="rounded-full bg-black text-white w-min px-3 py-2 text-[12px] flex gap-1">
                      <p>Sala</p>
                      <b>{reservation.room.name}</b>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-2 text-xs font-semibold rounded-full ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="px-2 justify-center py-4 whitespace-nowrap gap-4 flex">
                    {(reservation.status === "pending" ||
                      reservation.status === "confirmed") && (
                        <Button
                          variant="secondary"
                          size="icon"
                          className="size-8 rounded-full text-white bg-black cursor-pointer hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => handleCancelReservation(reservation.id)}
                          disabled={loadingActions[`cancel-${reservation.id}`]}
                        >
                          <X />
                        </Button>
                      )}

                    {reservation.status === "pending" && isAdmin && (
                      <Button
                        variant="secondary"
                        size="icon"
                        className="size-8 rounded-full text-white bg-black cursor-pointer hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleConfirmReservation(reservation.id)}
                        disabled={loadingActions[`confirm-${reservation.id}`]}
                      >
                        <Check />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
