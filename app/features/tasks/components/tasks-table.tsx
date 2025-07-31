"use client";

import { useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    createColumnHelper,
    flexRender,
    type SortingState,
    type ColumnFiltersState,
} from "@tanstack/react-table";
import {
    Plus,
    Edit,
    Trash2,
    Search,
    Calendar,
    Flag,
    ChevronUp,
    ChevronDown,
} from "lucide-react";
import {
    type CreateTaskDto,
    type TaskItemDto,
    type UpdateTaskDto,
} from "~/core/api/generated";
import { TaskModal } from "./task-modal";
import { Api } from "~/core/api";

const columnHelper = createColumnHelper<TaskItemDto>();

const priorityColors = {
    Low: "text-green-600 bg-green-50 border-green-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    High: "text-red-600 bg-red-50 border-red-200",
};

export function TasksTable() {
    const [tasks, setTasks] = useState<TaskItemDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"create" | "edit">("create");
    const [selectedTask, setSelectedTask] = useState<TaskItemDto | null>(null);

    const columns = [
        columnHelper.accessor("title", {
            header: "Title",
            cell: (info) => (
                <div className="font-medium text-gray-900">
                    {info.getValue()}
                </div>
            ),
        }),
        columnHelper.accessor("content", {
            header: "Description",
            cell: (info) => (
                <div className="text-gray-600 max-w-xs truncate">
                    {info.getValue() || "-"}
                </div>
            ),
        }),
        columnHelper.accessor("deadline", {
            header: "Deadline",
            cell: (info) => {
                const deadline = info.getValue();
                if (!deadline) return <span className="text-gray-400">-</span>;

                const date = new Date(deadline);
                const now = new Date();
                const isOverdue = date < now;

                return (
                    <div
                        className={`flex items-center space-x-1 ${
                            isOverdue ? "text-red-600" : "text-gray-600"
                        }`}
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                            {date.toLocaleDateString()}{" "}
                            {date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </div>
                );
            },
        }),
        columnHelper.accessor("priority", {
            header: "Priority",
            cell: (info) => {
                const priority = info.getValue();
                if (!priority) return <span className="text-gray-400">-</span>;

                return (
                    <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                            priorityColors[
                                priority as keyof typeof priorityColors
                            ]
                        }`}
                    >
                        <Flag className="h-3 w-3 mr-1" />
                        {priority}
                    </span>
                );
            },
        }),
        columnHelper.accessor("subtaskIds", {
            header: "Subtasks",
            cell: (info) => {
                const count = info?.getValue()?.length;
                return (
                    <span className="text-sm text-gray-600">
                        {count && count > 0
                            ? `${count} subtask${count > 1 ? "s" : ""}`
                            : "-"}
                    </span>
                );
            },
        }),
        columnHelper.display({
            id: "actions",
            header: "Actions",
            cell: (info) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEditTask(info.row.original)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteTask(+info.row.original.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: tasks,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await Api.Task.apiTaskGet();
            setTasks(data);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTask = () => {
        setModalMode("create");
        setSelectedTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task: TaskItemDto) => {
        setModalMode("edit");
        setSelectedTask(task);
        setIsModalOpen(true);
    };

    const handleDeleteTask = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await Api.Task.apiTaskIdDelete({ id });
                setTasks(tasks.filter((task) => task.id !== id));
            } catch (error) {
                console.error("Failed to delete task:", error);
            }
        }
    };

    const handleModalSubmit = async (data: CreateTaskDto | UpdateTaskDto) => {
        try {
            if (modalMode === "create") {
                await Api.Task.apiTaskPost({
                    createTaskDto: {
                        title: data.title ?? "",
                        content: data.content ?? "",
                        deadline: new Date(),
                        priority: data.priority,
                    },
                });
            } else if (selectedTask) {
                await Api.Task.apiTaskIdPatch({
                    id: selectedTask.id as number,
                    updateTaskDto: data as UpdateTaskDto,
                });
            }
        } catch (error) {
            console.error("Failed to save task:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                <button
                    onClick={handleCreateTask}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search tasks..."
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center space-x-1">
                                            <span>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext()
                                                      )}
                                            </span>
                                            {header.column.getCanSort() && (
                                                <div className="flex flex-col">
                                                    <ChevronUp
                                                        className={`h-3 w-3 ${
                                                            header.column.getIsSorted() ===
                                                            "asc"
                                                                ? "text-gray-900"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                    <ChevronDown
                                                        className={`h-3 w-3 -mt-1 ${
                                                            header.column.getIsSorted() ===
                                                            "desc"
                                                                ? "text-gray-900"
                                                                : "text-gray-400"
                                                        }`}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className="hover:bg-gray-50">
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap"
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {table.getRowModel().rows.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-500">No tasks found</div>
                    </div>
                )}
            </div>

            {/* Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                task={selectedTask}
                mode={modalMode}
            />
        </div>
    );
}
