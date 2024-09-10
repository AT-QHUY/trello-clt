package com.example.demo.controller;

import com.example.demo.model.dto.task.CreateTaskDto;
import com.example.demo.model.dto.task.GetTaskDto;
import com.example.demo.model.dto.task.MoveTaskDto;
import com.example.demo.model.dto.task.UpdateTaskDto;
import com.example.demo.service.ITaskService;
import com.example.demo.service.impl.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/task")
public class TaskController {

    @Autowired
    private ITaskService taskService;

    @PostMapping("/create")
    @PreAuthorize("hasAnyAuthority('USER')")
    public GetTaskDto createTask(@RequestBody CreateTaskDto createTaskDto) {
        return taskService.createNewTask(createTaskDto);
    }

    @GetMapping("/{id}")
    public GetTaskDto getTask(@PathVariable UUID id) {
        return taskService.getTaskById(id);
    }

    @PutMapping("/{id}/update")
    @PreAuthorize("hasAnyAuthority('USER')")
    public GetTaskDto updateTask(@PathVariable UUID id, @RequestBody UpdateTaskDto updateTaskDto) {
        return taskService.updateTask(id, updateTaskDto);
    }

    @PutMapping("/{id}/move")
    @PreAuthorize("hasAnyAuthority('USER')")
    public void moveTask(@PathVariable UUID id, @RequestBody MoveTaskDto moveTaskDto){
        taskService.updateTaskPosition(id, moveTaskDto.getMovedToColumnId(), moveTaskDto.getMovedBeforeTaskId());
    }

    @PutMapping("/{id}/take")
    @PreAuthorize("hasAnyAuthority('USER')")
    public void takeTask(@PathVariable UUID id){
        taskService.takeTask(id);
    }

    @DeleteMapping("/{id}/cancel")
    @PreAuthorize("hasAnyAuthority('USER')")
    public void cancelTask(@PathVariable UUID id){
        taskService.cancelTask(id);
    }
}
