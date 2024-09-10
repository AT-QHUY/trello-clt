package com.example.demo.mapper;

import com.example.demo.model.dto.task.GetTaskDto;
import com.example.demo.model.entity.impl.Task;

import java.util.List;

public class TaskMapper {
    public static GetTaskDto toDto(Task task) {
        if(task == null) return null;
        return GetTaskDto
                .builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .createdBy(UserMapper.toDto(task.getCreatedBy()) )
                .createdDate(task.getCreatedDate())
                .isPublic(task.isPublic())
                .columnId(task.getTaskList().getId())
                .position(task.getPosition())
                .attender(UserMapper.toDto(task.getAttender()))
                .build();
    }

    public static List<GetTaskDto> toDto(List<Task> tasks) {
        if(tasks == null) return null;
        return tasks.stream().map(TaskMapper::toDto).toList();
    }
}
