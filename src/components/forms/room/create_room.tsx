import { createRoomSchema, CreateRoomSchema } from "@/core/models/room.model";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTimeRange } from "@/util/hooks/use_time_range";
import { TimeRangeSelector } from "./time_range_selector";
import { TimeBlockSelector } from "./time_block_selector";
import { createRoomService } from "@/core/service/room";
import { Edit } from "lucide-react";

interface Props {
	setIsCreating?: (isCreating: boolean) => void;
	close: () => void;
}

export function CreateRoom({ setIsCreating, close }: Props) {
	const [isLoading, setIsLoading] = useState(false);

	const {
		startTime,
		endTime,
		setStartTime,
		setEndTime,
		startTimeOptions,
		endTimeOptions,
		validateTimeRange,
	} = useTimeRange();

	const form = useForm<CreateRoomSchema>({
		resolver: zodResolver(createRoomSchema),
		defaultValues: {
			name: "",
			startTime: "08:00",
			endTime: "22:00",
			time_block: 30,
		},
	});

	const handleStartTimeChange = (time: string) => {
		setStartTime(time);
		form.setValue("startTime", time);
	};

	const handleEndTimeChange = (time: string) => {
		setEndTime(time);
		form.setValue("endTime", time);
	};

	const handleTimeBlockChange = (value: string) => {
		form.setValue("time_block", Number(value));
	};

	const onSubmit = async (data: CreateRoomSchema) => {
		setIsLoading(true);

		const validation = validateTimeRange();
		if (!validation.isValid) {
			toast.message(validation.error);
			setIsLoading(false);
			return;
		}

		try {
			const roomData = {
				name: data.name,
				startTime: startTime,
				endTime: endTime,
				time_block: Number(data.time_block),
			};

			await createRoomService(roomData);

			toast.message("Sala criada com sucesso!");

			form.reset({
				name: "",
				startTime: "08:00",
				endTime: "18:00",
				time_block: 30,
			});
			setStartTime("08:00");
			setEndTime("18:00");
		} catch (error) {
			toast.message("Falha ao criar sala");
			console.error(error);
		} finally {
			setIsLoading(false);
			close();
		}
	};

	return (
		<form
			onSubmit={form.handleSubmit(onSubmit)}
			className="flex flex-col w-full"
		>
			<div className="flex flex-col gap-4  px-6">
				<div className="space-y-2">
					<label className="font-normal text-black text-[14px]">
						Nome da Sala
					</label>
					<div className="relative w-full">
						<div className="absolute left-3 top-1/2 transform -translate-y-1/2 font-normal text-black text-[14px] pointer-events-none z-10">
							Sala
						</div>
						<Input
							placeholder="101, A, B, etc."
							{...form.register("name")}
							className="w-full pl-11 font-bold"
						/>
					</div>
				</div>

				<TimeRangeSelector
					startTime={startTime}
					endTime={endTime}
					onStartTimeChange={handleStartTimeChange}
					onEndTimeChange={handleEndTimeChange}
					startTimeOptions={startTimeOptions}
					endTimeOptions={endTimeOptions}
				/>

				<TimeBlockSelector
					onValueChange={handleTimeBlockChange}
					value={form.watch("time_block").toString()}
					label="Bloco de Horários de agendamento"
				/>
				<div className="w-full border-t"></div>
				<Button
					onClick={() => {
						if (setIsCreating) {
							setIsCreating(false);
						}
					}}
					type="button"
					variant="ghost"
					className="w-full mb-4 flex items-center justify-start font-medium text-[16px] cursor-pointer"
				>
					<Edit size={22} className="mr-2" />
					<div>Editar sala</div>
				</Button>
			</div>

			<div className="flex w-full py-4 border-t border-[#D7D7D7] shadow-2xl items-center px-6 justify-center">
				<Button type="submit" disabled={isLoading} className="w-full cursor-pointer">
					{isLoading ? "Criando..." : "Criar Sala"}
				</Button>
			</div>
		</form>
	);
}
