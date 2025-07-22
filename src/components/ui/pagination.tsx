"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/core/lib/utils";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	onPageChange: (page: number) => void;
	isLoading?: boolean;
	totalItems?: number;
	itemsPerPage?: number;
	showInfo?: boolean;
	showPageNumbers?: boolean;
	maxVisiblePages?: number;
	className?: string;
	size?: "sm" | "lg" | "default";
}

export function Pagination({
	currentPage,
	totalPages,
	hasNextPage,
	hasPrevPage,
	onPageChange,
	isLoading = false,
	totalItems,
	itemsPerPage,
	showInfo = true,
	showPageNumbers = true,
	maxVisiblePages = 2,
	className,
	size = "sm",
}: PaginationProps) {
	if (totalPages <= 1) return null;

	const buttonSizeClasses = {
		sm: "h-8 px-3 text-xs",
		default: "h-9 px-4 text-sm",
		lg: "h-10 px-6 text-base",
	};

	const getVisiblePages = () => {
		const delta = maxVisiblePages;
		const range = [];
		const rangeWithDots = [];

		for (
			let i = Math.max(2, currentPage - delta);
			i <= Math.min(totalPages - 1, currentPage + delta);
			i++
		) {
			range.push(i);
		}

		if (currentPage - delta > 2) {
			rangeWithDots.push(1, "...");
		} else {
			rangeWithDots.push(1);
		}

		rangeWithDots.push(...range);

		if (currentPage + delta < totalPages - 1) {
			rangeWithDots.push("...", totalPages);
		} else if (totalPages > 1) {
			rangeWithDots.push(totalPages);
		}

		return rangeWithDots.filter(
			(item, index, arr) => arr.indexOf(item) === index
		);
	};

	const visiblePages = showPageNumbers ? getVisiblePages() : [];

	const getItemsInfo = () => {
		if (!totalItems || !itemsPerPage) return null;

		const startItem = (currentPage - 1) * itemsPerPage + 1;
		const endItem = Math.min(currentPage * itemsPerPage, totalItems);

		return `${startItem}-${endItem} de ${totalItems} itens`;
	};

	const getPagesInfo = () => {
		return `Página ${currentPage} de ${totalPages}`;
	};

	return (
		<div
			className={cn(
				"flex items-center justify-between bg-white px-4 py-3 border-t",
				className
			)}
		>
			{showInfo && (
				<div className="flex items-center">
					<p className="text-sm text-gray-700">
						{totalItems && itemsPerPage ? getItemsInfo() : getPagesInfo()}
					</p>
				</div>
			)}

			<div
				className={cn("flex items-center space-x-2", !showInfo && "mx-auto")}
			>
				<Button
					size={size}
					onClick={() => onPageChange(currentPage - 1)}
					disabled={!hasPrevPage || isLoading}
					className={`h-7 w-7 cursor-pointer text-white bg-black hover:bg-gray-800 hover:text-white disabled:bg-gray-200 disabled:text-gray-500`}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>

				{showPageNumbers && (
					<div className="flex items-center space-x-1">
						{visiblePages.map((page, index) => (
							<React.Fragment key={index}>
								{page === "..." ? (
									<span className="px-3 py-2 text-sm text-gray-500">...</span>
								) : (
									<Button
										variant={page === currentPage ? "default" : "outline"}
										size={size}
										onClick={() => onPageChange(page as number)}
										disabled={isLoading}
										className={cn(
											"min-w-[36px] min-h-10 cursor-pointer ",
											buttonSizeClasses[size]
										)}
									>
										{page}
									</Button>
								)}
							</React.Fragment>
						))}
					</div>
				)}

				<Button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={!hasNextPage || isLoading}
					className={`cursor-pointer h-7 w-7 text-white bg-black hover:bg-gray-800 hover:text-white disabled:bg-gray-200 disabled:text-gray-500`}
				>
					<ChevronRight className="h-2 w-2" />
				</Button>
			</div>

			<div />
		</div>
	);
}
