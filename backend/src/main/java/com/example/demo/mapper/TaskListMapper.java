package com.example.demo.mapper;


import com.example.demo.model.dto.tasklist.GetTaskListDto;
import com.example.demo.model.entity.impl.TaskList;

import java.util.ArrayList;
import java.util.List;

public class TaskListMapper {
    public static GetTaskListDto toDto(TaskList taskList) {
        if (taskList == null) {
            return null;
        }
        GetTaskListDto taskListDto =  GetTaskListDto
                .builder()
                .id(taskList.getId())
                .name(taskList.getName())
                .tasks(TaskMapper.toDto(taskList.getTasks()))
                .build();

        return taskListDto;
    }

    public static List<GetTaskListDto> toDto(List<TaskList> taskLists) {
        if(taskLists == null) return null;
        List<GetTaskListDto> taskListDtos = taskLists.stream().map(TaskListMapper::toDto).toList();
        return taskListDtos;
    }
}
