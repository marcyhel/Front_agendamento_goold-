import { CepResponse } from "@/core/models/register.model";

export const getCepService = async (cep: string): Promise<CepResponse> => {
	const cleanCep = cep.replace(/\D/g, "");

	if (cleanCep.length !== 8) {
		throw new Error("CEP deve ter 8 dígitos");
	}

	const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

	if (!response.ok) {
		throw new Error("Erro ao buscar CEP");
	}

	const data: CepResponse = await response.json();

	if (data.erro) {
		throw new Error("CEP não encontrado");
	}

	return data;
};
