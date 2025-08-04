"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Calendar, Flag } from "lucide-react";
import type {
    CreateTaskDto,
    TaskItemDto,
    UpdateTaskDto,
} from "~/core/api/generated";
import {
    Dialog,
    DialogHeader,
    DialogPortal,
    DialogContent,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void;
    task?: TaskItemDto | null;
    pendingSubmit?: boolean;
}

const priorityOptions = ["Low", "Medium", "High"];

const priorityColors = {
    Low: "text-green-600 bg-green-50 border-green-200",
    Medium: "text-yellow-600 bg-yellow-50 border-yellow-200",
    High: "text-red-600 bg-red-50 border-red-200",
};

export function TaskModal({
    isOpen,
    onClose,
    onSubmit,
    task,
    pendingSubmit,
}: TaskModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTaskDto>();

    useEffect(() => {
        if (task) {
            reset({
                title: task.title,
                content: task.content || "",
                deadline: task.deadline ? new Date(task.deadline) : null,
                priority: task.priority || "",
            });
        } else {
            reset({
                title: "",
                content: "",
                deadline: null,
                priority: "",
            });
        }
    }, [task, reset]);

    const onFormSubmit = (data: CreateTaskDto) => {
        onSubmit(data);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(s) => onClose()}>
            <DialogPortal>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="text-xl font-semibold">
                            {task ? "Edit Task" : "Add New Task"}
                        </h2>
                    </DialogHeader>
                    <form
                        onSubmit={handleSubmit(onFormSubmit)}
                        className="space-y-4"
                    >
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Title *
                            </label>
                            <input
                                {...register("title", {
                                    required: "Title is required",
                                })}
                                type="text"
                                id="title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter task title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Description
                            </label>
                            <textarea
                                {...register("content")}
                                id="content"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder="Enter task description"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="deadline"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                <Calendar className="inline h-4 w-4 mr-1" />
                                Deadline
                            </label>
                            <input
                                {...register("deadline")}
                                type="datetime-local"
                                id="deadline"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="priority"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                <Flag className="inline h-4 w-4 mr-1" />
                                Priority
                            </label>
                            <select
                                {...register("priority")}
                                id="priority"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select priority</option>
                                {priorityOptions.map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                disabled={pendingSubmit}
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <Button isLoading={pendingSubmit}>
                                {task ? "Update Task" : "Create Task"}
                            </Button>
                            {/* <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
                            >
                            </button> */}
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
