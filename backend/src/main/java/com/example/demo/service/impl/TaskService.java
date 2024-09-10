package com.example.demo.service.impl;

import com.example.demo.mapper.TaskMapper;
import com.example.demo.model.dto.task.CreateTaskDto;
import com.example.demo.model.dto.task.GetTaskDto;
import com.example.demo.model.dto.task.UpdateTaskDto;
import com.example.demo.model.entity.impl.Task;
import com.example.demo.model.entity.impl.TaskList;
import com.example.demo.model.entity.impl.User;
import com.example.demo.repository.TaskListRepository;
import com.example.demo.repository.TaskRepository;
import com.example.demo.service.ITaskService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class TaskService implements ITaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TaskListRepository taskListRepository;
    @Autowired
    private CustomUserDetailService customUserDetailService;
    @Override
    public GetTaskDto createNewTask(CreateTaskDto createTaskDto) {
        Optional<Task> latestTask = taskRepository.findFirstByTaskListIdOrderByPositionDesc(createTaskDto.getColumnId());
        long latestId = latestTask.map(value -> value.getPosition() + 1).orElse(1L);

        Task task = Task
                .builder()
                .title(createTaskDto.getTitle())
                .description(createTaskDto.getDescription())
                .dueDate(createTaskDto.getDueDate())
                .taskList(TaskList.builder().id(createTaskDto.getColumnId()).build())
                .isPublic(createTaskDto.isPublic())
                .position(latestId)
                .build();
        return TaskMapper.toDto(taskRepository.save(task));
    }

    @Override
    public GetTaskDto getTaskById(UUID id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        return TaskMapper.toDto(taskOptional.get());
    }

    @Override
    public GetTaskDto updateTask(UUID id, UpdateTaskDto updateTaskDto) {
        Task task = taskRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        TaskList taskList = taskListRepository.findById(updateTaskDto.getTaskListId()).orElseThrow((EntityNotFoundException::new));
        task.setTitle(updateTaskDto.getTitle());
        task.setDescription(updateTaskDto.getDescription());
        task.setTaskList(taskList);
        task.setDueDate(updateTaskDto.getDueDate());
        task.setPublic(updateTaskDto.isPublic());
        return TaskMapper.toDto(taskRepository.save(task));
    }

    @Override
    public void updateTaskPosition(UUID id,UUID movedToTaskListId, UUID movedBeforePositionId) {
        Optional<Task> currentTaskOptional = taskRepository.findById(id);

        if (currentTaskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        Optional<TaskList> movedToTaskListOptional = taskListRepository.findById(movedToTaskListId);

        if (movedToTaskListOptional.isEmpty()) {
            throw new EntityNotFoundException("Task List with id " + movedToTaskListId + " not found");
        }

        Optional<Task> movedBeforeTaskOptional = movedBeforePositionId == null ? Optional.empty() : taskRepository.findById(movedBeforePositionId);

        Task currentTask = currentTaskOptional.get();
        TaskList movedToTaskList = movedToTaskListOptional.get();

        long movedToPosition = 1;
        if(movedBeforeTaskOptional.isPresent()){
             movedToPosition = movedBeforeTaskOptional.get().getPosition();
            List<Task> tasks = taskRepository.findByTaskListId(movedToTaskList.getId());
            for (Task task : tasks) {
                if(task.getPosition() >= movedToPosition && !task.getId().equals(currentTask.getId())){
                    task.setPosition(task.getPosition() + 1);
                }
            }
            taskRepository.saveAll(tasks);
        }else{
            Optional<Task> latestTaskOptional = taskRepository.findFirstByTaskListIdOrderByPositionDesc(movedToTaskList.getId());
            if (latestTaskOptional.isPresent()) {
                movedToPosition = latestTaskOptional.get().getPosition() + 1;
            }
        }
        if (!currentTask.getTaskList().getId().equals(movedToTaskListId)) {
            currentTask.setTaskList(movedToTaskList);
        }
        currentTask.setPosition(movedToPosition);
        taskRepository.save(currentTask);
    }

    @Override
    public void takeTask(UUID id) {
        Optional<User> currentUser = customUserDetailService.getCurrentUser();
        if (currentUser.isEmpty()) {
            throw new EntityNotFoundException("User not logged in");
        }

        Optional<Task> taskOptional = taskRepository.findById(id);

        if (taskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        if(taskOptional.get().getAttender() != null){
            throw new UnsupportedOperationException("Task is already taken by user id: " + taskOptional.get().getAttender().getId());
        }
        Optional<TaskList> inProgressTaskListOptional = taskListRepository.findByName("In progress");

        if(inProgressTaskListOptional.isEmpty()){
            throw new EntityNotFoundException("TaskList with title " + "In Progress" + " not found");
        }
        taskOptional.get().setAttender(currentUser.get());
        taskOptional.get().setTaskList(inProgressTaskListOptional.get());
        taskRepository.save((taskOptional.get()));
    }

    @Override
    public void cancelTask(UUID id) {
         customUserDetailService.getCurrentUser().orElseThrow();

        Optional<Task> taskOptional = taskRepository.findById(id);

        if (taskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        Optional<TaskList> cancelTaskListOptional = taskListRepository.findByName("Cancel");

        if(cancelTaskListOptional.isEmpty()){
            throw new EntityNotFoundException("TaskList with title " + "In Progress" + " not found");
        }
        taskOptional.get().setTaskList(cancelTaskListOptional.get());
        taskOptional.get().setAttender(null);
        taskRepository.save((taskOptional.get()));
    }
}


