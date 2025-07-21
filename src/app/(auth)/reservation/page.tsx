"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserPermissions } from "@/util/hooks/use_user";
import { LogoutButton } from "@/components/logout/logout_button";
import {
  ReservationFilters,
  ReservationList,
  NewReservationModal,
} from "@/components/reservation";
import { ReservationSettingsModal } from "@/components/reservation/reservation_settings";
import { Pagination } from "@/components/ui/pagination";
import { getReservationsService, getReservationsServiceAdmin } from "@/core/service/reservation";

import { toast } from "sonner";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { ReservationModel, ReservationListResponse, ReservationFilters as ReservationFiltersType } from "@/core/models/reservation.model";

export default function ReservationPage() {
  const { canManageScheduling, isAdmin } = useUserPermissions();
  const [reservations, setReservations] = useState<ReservationModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState<ReservationFiltersType>({
    limit: 5,
    page: 1,
    sortBy: "date",
    sortOrder: "DESC",
  });

  const fetchReservations = useCallback(
    async (currentFilters: ReservationFiltersType) => {
      try {
        setIsLoading(true);
        let response: ReservationListResponse;
        if (isAdmin) {
          response = await getReservationsServiceAdmin(currentFilters);
        } else {
          response = await getReservationsService(currentFilters);
        }
        setReservations(response.data);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
          hasNextPage: response.hasNextPage,
          hasPrevPage: response.hasPrevPage,
        });
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
        toast.message("Erro ao carregar agendamentos", {
          description: "Tente novamente mais tarde.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    fetchReservations(filters);
  }, [filters, fetchReservations]);

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ReservationFiltersType>) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        ...newFilters,
        page: 1,
      }));
    },
    []
  );

  const handleSortChange = useCallback(
    (sortBy: string, sortOrder: "ASC" | "DESC") => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        sortBy,
        sortOrder,
        page: 1,
      }));
    },
    []
  );

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
  };

  const handleSettingsSaved = () => {
    fetchReservations(filters);
  };

  const handleReservationCreated = () => {
    fetchReservations(filters);
  };

  const handleReservationUpdate = (
    reservationId: string,
    newStatus: "confirmed" | "cancelled"
  ) => {
    if (newStatus === "confirmed") {
      fetchReservations(filters);
      return;
    }
    setReservations((prevReservations) =>
      prevReservations.map((reservation) =>
        reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation
      )
    );
  };

  if (!canManageScheduling) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para acessar esta página.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col">
      <Header
        title="Agendamentos"
        subtitle={isAdmin ? "Acompanhe todos os agendamentos de clientes de forma simples" : "Acompanhe todos os seus agendamento de forma simples"}
      />

      <div className="flex w-full h-full flex-col justify-between overflow-hidden p-6">
        <div className="flex-1 flex flex-col w-full min-h-0 border rounded-sm border-[#D7D7D7] px-4 py-8">
          <div className="flex w-full gap-20 border-b border-[#D7D7D7] mb-8">
            <ReservationFilters
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
            />

            {isAdmin ? (
              <Button
                type="button"
                onClick={() => setIsSettingsModalOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-5 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
              >
                Ajustes de agendamento
              </Button>
            ) : (
              <Button
                type="button"
                onClick={() => setIsNewReservationModalOpen(true)}
                className="bg-black hover:bg-gray-800 text-white px-6 py-5 rounded flex items-center justify-center gap-2 cursor-pointer text-[16px] font-semibold"
              >
                Novo Agendamento
              </Button>
            )}
          </div>

          <div className="space-y-4 flex-1 flex flex-col min-h-0">
            <div className="flex-1 min-h-0">
              <ReservationList
                reservations={reservations}
                isLoading={isLoading}
                isAdmin={isAdmin}
                onReservationUpdate={handleReservationUpdate}
                sortBy={filters.sortBy}
                sortOrder={filters.sortOrder}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
          totalItems={pagination.totalItems}
          itemsPerPage={filters.limit || 10}
        />
      </div>

      <ReservationSettingsModal
        open={isSettingsModalOpen}
        close={() => setIsSettingsModalOpen(false)}
        onOpenChange={setIsSettingsModalOpen}
        onSettingsSaved={handleSettingsSaved}
      />

      <NewReservationModal
        open={isNewReservationModalOpen}
        close={() => setIsNewReservationModalOpen(false)}
        onOpenChange={setIsNewReservationModalOpen}
        onReservationCreated={handleReservationCreated}
      />
    </div>
  );
}
