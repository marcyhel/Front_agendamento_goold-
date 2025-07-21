import React, { useState } from "react";

interface TimeRangeSelectorProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  startTimeOptions: string[];
  endTimeOptions: string[];
  label?: string;
}

export function TimeRangeSelector({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  startTimeOptions,
  endTimeOptions,
  label = "Horário Inicial & Final da sala",
}: TimeRangeSelectorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTimeSelect = (time: string, type: "start" | "end") => {
    if (type === "start") {
      onStartTimeChange(time);
    } else {
      onEndTimeChange(time);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const displayText =
    startTime && endTime ? `${startTime} - ${endTime}` : "Selecionar horário";

  return (
    <div className="w-full relative">
      <label className="font-normal text-black text-[14px]">{label}</label>

      {/* Main Input Container */}
      <div className="relative">
        <div
          className="w-full px-4 py-2 border border-gray-200 rounded-lg cursor-pointer transition-colors flex items-center justify-between"
          onClick={() => setIsModalOpen(true)}
        >
          <span className="font-normal text-black text-[14px]">
            {displayText}
          </span>
          <ClockIcon />
        </div>

        {/* Time Selection Modal */}
        {isModalOpen && (
          <TimeSelectionModal
            startTime={startTime}
            endTime={endTime}
            startTimeOptions={startTimeOptions}
            endTimeOptions={endTimeOptions}
            onTimeSelect={handleTimeSelect}
            onClose={closeModal}
          />
        )}
      </div>

      {/* Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-40" onClick={closeModal} />
      )}
    </div>
  );
}

function ClockIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

interface TimeSelectionModalProps {
  startTime: string;
  endTime: string;
  startTimeOptions: string[];
  endTimeOptions: string[];
  onTimeSelect: (time: string, type: "start" | "end") => void;
  onClose: () => void;
}

function TimeSelectionModal({
  startTime,
  endTime,
  startTimeOptions,
  endTimeOptions,
  onTimeSelect,
  onClose,
}: TimeSelectionModalProps) {
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">
          Selecionar Horário
        </h3>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Start Time Column */}
          <TimeColumn
            label="Horário de Início"
            selectedTime={startTime}
            timeOptions={startTimeOptions}
            onTimeSelect={(time) => onTimeSelect(time, "start")}
          />

          {/* End Time Column */}
          <TimeColumn
            label="Horário de Término"
            selectedTime={endTime}
            timeOptions={endTimeOptions}
            onTimeSelect={(time) => onTimeSelect(time, "end")}
          />
        </div>

        <ModalActions onCancel={onClose} onConfirm={onClose} />
      </div>
    </div>
  );
}

interface TimeColumnProps {
  label: string;
  selectedTime: string;
  timeOptions: string[];
  onTimeSelect: (time: string) => void;
}

function TimeColumn({
  label,
  selectedTime,
  timeOptions,
  onTimeSelect,
}: TimeColumnProps) {
  return (
    <div>
      <label className="font-normal text-black text-[14px]">{label}</label>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {timeOptions.map((time) => (
          <TimeOption
            key={time}
            time={time}
            isSelected={selectedTime === time}
            onSelect={() => onTimeSelect(time)}
          />
        ))}
      </div>
    </div>
  );
}

interface TimeOptionProps {
  time: string;
  isSelected: boolean;
  onSelect: () => void;
}

function TimeOption({ time, isSelected, onSelect }: TimeOptionProps) {
  return (
    <div
      className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${
        isSelected
          ? "bg-blue-100 text-blue-700 font-medium"
          : "hover:bg-gray-100 text-gray-700"
      }`}
      onClick={onSelect}
    >
      {time}
    </div>
  );
}

interface ModalActionsProps {
  onCancel: () => void;
  onConfirm: () => void;
}

function ModalActions({ onCancel, onConfirm }: ModalActionsProps) {
  return (
    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
      <button
        type="button"
        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        onClick={onCancel}
      >
        Cancelar
      </button>
      <button
        type="button"
        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        onClick={onConfirm}
      >
        Confirmar
      </button>
    </div>
  );
}
