package com.example.demo.service;

import com.example.demo.model.dto.task.CreateTaskDto;
import com.example.demo.model.dto.task.GetTaskDto;
import com.example.demo.model.dto.task.UpdateTaskDto;
import com.example.demo.model.entity.impl.Task;

import java.util.List;
import java.util.UUID;

public interface ITaskService {
    public GetTaskDto  createNewTask(CreateTaskDto  createTaskDto);
    public GetTaskDto getTaskById(UUID id);
    public GetTaskDto updateTask(UUID id, UpdateTaskDto updateTaskDto);
    public void updateTaskPosition(UUID id,UUID movedToTaskListId,  UUID movedBeforePositionId);
    public void takeTask(UUID id);
    public void cancelTask(UUID id);
}
