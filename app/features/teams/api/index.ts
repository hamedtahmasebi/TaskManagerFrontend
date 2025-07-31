import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Api } from "~/core/api";
import type { ApiTeamIdGetRequest } from "~/core/api/generated";

export function useTeamsQuery() {
    return useQuery({
        queryKey: ["Teams", "GetTeams"],
        queryFn: () => Api.Team.apiTeamGet(),
    });
}

export function useTeamByIdQuery({ id }: ApiTeamIdGetRequest) {
    return useQuery({
        queryKey: ["Teams", "GetTeam"],
        queryFn: () => Api.Team.apiTeamIdGet({ id }),
        enabled: !!id,
    });
}

export function useCreateTeamMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: Api.Team.apiTeamPost,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["Teams", "GetTeams"] });
        },
    });
}

export function useDeleteTeamMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: Api.Team.apiTeamIdDelete,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["Teams"] });
        },
    });
}

export function useUpdateTeamMutation() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: Api.Team.apiTeamIdPut,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["Teams"] });
        },
    });
}
