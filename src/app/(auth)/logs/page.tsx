"use client";

import { useState, useEffect, useCallback } from "react";
import { useUserPermissions } from "@/util/hooks/use_user";
import { LogoutButton } from "@/components/logout/logout_button";
import { LogFilters as FiltersPanel, LogList as LogsTable } from "@/components/log";
import { Pagination } from "@/components/ui/pagination";
import { getLogsService, getLogsServiceAdmin } from "@/core/service/log";
import { LogModel, LogFilters as FiltersType, LogListResponse, } from "@/core/models/log.model";
import { toast } from "sonner";
import Header from "@/components/header";

const LogsPage = () => {
  const { isAdmin, canViewLogs } = useUserPermissions();

  const [logItems, setLogItems] = useState<LogModel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [paginationData, setPaginationData] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [queryParams, setQueryParams] = useState<FiltersType>({
    limit: 5,
    page: 1,
    sortOrder: "DESC",
  });

  const retrieveLogs = useCallback(async (filters: FiltersType) => {
    setLoading(true);

    try {
      const response: LogListResponse = isAdmin
        ? await getLogsServiceAdmin(filters)
        : await getLogsService(filters);

      setLogItems(response.data);
      setPaginationData({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        hasNextPage: response.hasNextPage,
        hasPrevPage: response.hasPrevPage,
      });
    } catch (err) {
      console.error("Falha ao carregar logs:", err);
      toast.message("Erro ao carregar logs", {
        description: "Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    retrieveLogs(queryParams);
  }, [queryParams, retrieveLogs]);

  const updateFilters = useCallback((updated: Partial<FiltersType>) => {
    setQueryParams(prev => ({
      ...prev,
      ...updated,
      page: 1,
    }));
  }, []);

  const changeSorting = useCallback(
    (field: string, direction: "ASC" | "DESC") => {
      setQueryParams(prev => ({
        ...prev,
        sortBy: field,
        sortOrder: direction,
        page: 1,
      }));
    },
    []
  );

  const goToPage = (page: number) => {
    setQueryParams(prev => ({
      ...prev,
      page,
    }));
  };

  if (!isAdmin && !canViewLogs) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Acesso Negado
          </h1>
          <p className="text-gray-600">
            Você não tem permissão para visualizar esta seção.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <Header title="Logs" subtitle={isAdmin ? "Acomapnhe todas as Logs de clientes" : "Acompanhe todos as suas Logs"} />

      <div className="flex flex-col w-full h-full p-6 justify-between overflow-hidden">
        <div className="flex flex-col flex-1 min-h-0 border border-[#D7D7D7] rounded-sm px-4 py-8">
          <div className="flex w-full border-b border-[#D7D7D7] mb-8">
            <div className="flex items-center w-4/5">
              <FiltersPanel
                isLoading={loading}
                onFiltersChange={updateFilters}
              />
            </div>
          </div>

          <div className="flex flex-col flex-1 min-h-0 space-y-4">
            <div className="flex-1 min-h-0">
              <LogsTable
                isAdmin={isAdmin}
                logs={logItems}
                isLoading={loading}
                sortBy={queryParams.sortBy}
                sortOrder={queryParams.sortOrder}
                onSortChange={changeSorting}
              />
            </div>
          </div>
        </div>

        <Pagination
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          hasNextPage={paginationData.hasNextPage}
          hasPrevPage={paginationData.hasPrevPage}
          onPageChange={goToPage}
          isLoading={loading}
          totalItems={paginationData.totalItems}
          itemsPerPage={queryParams.limit ?? 5}
        />
      </div>
    </div>
  );
};

export default LogsPage;
