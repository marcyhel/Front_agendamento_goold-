import { useState } from "react";

export interface UseTimeRangeProps {
  startHour?: number;
  endStartHour?: number;
  endHour?: number;
  endEndHour?: number;
}

export function useTimeRange({
  startHour = 6,
  endStartHour = 7,
  endHour = 19,
  endEndHour = 20,
}: UseTimeRangeProps = {}) {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const generateTimeOptions = (start: number, end: number): string[] => {
    const options = [];
    for (let hour = start; hour <= end; hour++) {
      const timeString = `${hour.toString().padStart(2, "0")}:00`;
      options.push(timeString);
    }
    return options;
  };

  const startTimeOptions = generateTimeOptions(startHour, endHour);
  const endTimeOptions = generateTimeOptions(endStartHour, endEndHour);

  const validateTimeRange = (): { isValid: boolean; error?: string } => {
    if (!startTime || !endTime) {
      return {
        isValid: false,
        error: "Por favor, selecione o horário de início e término",
      };
    }

    const startHour = parseInt(startTime.split(":")[0]);
    const endHour = parseInt(endTime.split(":")[0]);

    if (endHour <= startHour) {
      return {
        isValid: false,
        error: "O horário de término deve ser posterior ao horário de início",
      };
    }

    return { isValid: true };
  };

  const resetTimes = () => {
    setStartTime("");
    setEndTime("");
  };

  return {
    startTime,
    endTime,
    setStartTime,
    setEndTime,
    startTimeOptions,
    endTimeOptions,
    validateTimeRange,
    resetTimes,
  };
}
