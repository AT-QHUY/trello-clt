package com.example.demo.controller;

import com.example.demo.model.dto.tasklist.CreateTaskListDto;
import com.example.demo.model.dto.tasklist.GetTaskListDto;
import com.example.demo.model.entity.impl.TaskList;
import com.example.demo.service.ITaskListService;
import com.example.demo.service.impl.TaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/taskList")
public class TaskListController {
    @Autowired
    private ITaskListService taskListService;

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('USER')")
    public List<GetTaskListDto> getAllTaskLists(@RequestParam(required = false) String search) {
        return taskListService.getTaskByCurrentUserAndTitle(search);
    }

    @PostMapping("/create")
    public GetTaskListDto createTaskList(@RequestBody CreateTaskListDto taskList) {
        return taskListService.createTaskList(taskList);
    }

}
