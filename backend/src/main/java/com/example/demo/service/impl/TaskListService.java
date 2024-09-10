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

    @Override
    public List<GetTaskListDto> getTaskLists() {


        List<TaskList> taskLists = taskListRepository.findAll();
        return TaskListMapper.toDto(taskLists);
    }

    @Override
    public GetTaskListDto createTaskList(CreateTaskListDto createTaskListDto) {
        TaskList taskList = TaskList
                                .builder()
                                .name(createTaskListDto.getName())
                                .build();

        TaskList createdTaskList = taskListRepository.save(taskList);
        return TaskListMapper.toDto(createdTaskList);
    }

    @Override
    public List<GetTaskListDto> getTaskByCurrentUserAndTitle(String title) {
        Optional<User> currentUser = customUserDetailService.getCurrentUser();
        List<TaskList> taskLists = taskListRepository.findAll();

        if(currentUser.isEmpty()) {
            return TaskListMapper.toDto(taskLists);
        }
        for(TaskList taskList : taskLists) {
            taskList.setTasks(taskRepository.findByUserIdOrPublicStatusAndTaskListIdAndTitleOrderByPositionAsc(currentUser.get().getId(), true, taskList.getId(), title));
        }

        return TaskListMapper.toDto(taskLists);
    }
}
