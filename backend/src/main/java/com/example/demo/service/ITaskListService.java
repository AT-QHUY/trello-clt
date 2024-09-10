package com.example.demo.service;

import com.example.demo.model.dto.tasklist.CreateTaskListDto;
import com.example.demo.model.dto.tasklist.GetTaskListDto;

import java.util.List;

public interface ITaskListService {
    public List<GetTaskListDto> getTaskLists();
    public GetTaskListDto createTaskList(CreateTaskListDto createTaskListDto);
    public List<GetTaskListDto> getTaskByCurrentUserAndTitle(String title);

}
