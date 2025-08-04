import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Api } from "~/core/api";
import type { CreateTaskDto, UpdateTaskDto } from "~/core/api/generated";

export function useGetTasks({
    deps,
    page,
    size,
    searchString,
}: {
    deps?: string[];
    page: number;
    size: number;
    searchString?: string;
    sortBy?: string[];
    sortDirection?: Array<"asc" | "desc">;
}) {
    return useQuery({
        queryKey: ["Tasks", "GetTasks", ...(deps || [])],
        queryFn: () => Api.Task.apiTaskGet({ page, size, searchString }),
        refetchOnWindowFocus: false,
    });
}

export function useGetTaskById({ id }: { id: number }) {
    return useQuery({
        queryKey: ["Tasks", "GetTaskById", id],
        queryFn: () => Api.Task.apiTaskIdGet({ id }),
    });
}

export function useCreateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: CreateTaskDto) =>
            Api.Task.apiTaskPost({ createTaskDto: data }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["Tasks", "GetTasks"] });
        },
    });
}

export function useUpdateTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateTaskDto }) =>
            Api.Task.apiTaskIdPatch({ id, updateTaskDto: data }),
        onSuccess: (_, variables) => {
            qc.invalidateQueries({ queryKey: ["Tasks", "GetTasks"] });
            qc.invalidateQueries({
                queryKey: ["Tasks", "GetTaskById", variables.id],
            });
        },
    });
}

export function useDeleteTask() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => Api.Task.apiTaskIdDelete({ id }),
        onSuccess: (_, variables) => {
            toast.success("Task deleted");
            qc.invalidateQueries({ queryKey: ["Tasks", "GetTasks"] });
            qc.invalidateQueries({
                queryKey: ["Tasks", "GetTaskById", variables],
            });
        },
    });
}
