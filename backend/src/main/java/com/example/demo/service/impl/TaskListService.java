package com.example.demo.service.impl;

import com.example.demo.mapper.TaskListMapper;
import com.example.demo.model.dto.tasklist.CreateTaskListDto;
import com.example.demo.model.dto.tasklist.GetTaskListDto;
import com.example.demo.model.entity.impl.TaskList;
import com.example.demo.model.entity.impl.User;
import com.example.demo.repository.TaskListRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.ITaskListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskListService implements ITaskListService {

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private CustomUserDetailService customUserDetailService;

    @Autowired
    private TaskRepository taskRepository;

    // View all task
    // Input: none
    // Output: List of column and corresponding tasks
    // Business: (TODO)
    @Override
    public List<GetTaskListDto> getTaskLists() {
        List<TaskList> taskLists = taskListRepository.findAll();
        return TaskListMapper.toDto(taskLists);
    }

    // Create new column
    @Override
    public GetTaskListDto createTaskList(CreateTaskListDto createTaskListDto) {
        TaskList taskList = TaskList
                                .builder()
                                .name(createTaskListDto.getName())
                                .build();

        TaskList createdTaskList = taskListRepository.save(taskList);
        return TaskListMapper.toDto(createdTaskList);
    }

    // FR1: View task
    // Input: title (for search purpose)
    // Output: List of column and corresponding tasks
    // Business: Only task with corresponding user is taken
    @Override
    public List<GetTaskListDto> getTaskByCurrentUserAndTitle(String title) {

        // Get current user
        Optional<User> currentUser = customUserDetailService.getCurrentUser();

        // Get all column
        List<TaskList> taskLists = taskListRepository.findAll();

        // if NO user found return empty column
        if(currentUser.isEmpty()) {
            return TaskListMapper.toDto(taskLists);
        }

        // if user found add tasks to column
        for(TaskList taskList : taskLists) {
            taskList.setTasks(taskRepository.findByUserIdOrPublicStatusAndTaskListIdAndTitleOrderByPositionAsc(currentUser.get().getId(), true, taskList.getId(), title));
        }

        return TaskListMapper.toDto(taskLists);
    }
}
