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

    // FR2: Create new task
    // Input: title, description, dueDate, isPublic
    // Output: created task data
    // Business: - New task when created is auto added to "To do" column
    //           - New task is added to last of column

    @Override
    public GetTaskDto createNewTask(CreateTaskDto createTaskDto) {

        // Find To do column --> Throw if NOT found
        Optional<TaskList> todoTaskListOptional = taskListRepository.findByName("To do");
        if(todoTaskListOptional.isEmpty()){
            throw new EntityNotFoundException("To do task list  found");
        }

        // Find the latest position of column
        Optional<Task> latestTask = taskRepository.findFirstByTaskListIdOrderByPositionDesc(todoTaskListOptional.get().getId());
        long latestId = latestTask.map(value -> value.getPosition() + 1).orElse(1L);

        Task task = Task
                .builder()
                .title(createTaskDto.getTitle())
                .description(createTaskDto.getDescription())
                .dueDate(createTaskDto.getDueDate())
                .taskList(TaskList.builder().id(todoTaskListOptional.get().getId()).build())
                .isPublic(createTaskDto.isPublic())
                .position(latestId)
                .build();
        return TaskMapper.toDto(taskRepository.save(task));
    }

    // FR3: Update task
    // Input: task's id, title, description, dueDate, isPublic
    // Output: New updated task data
    // Business: - Cannot update canceled task
    //           - With public task: attender can update, if no attender creator can update
    //           - With private task: only creator can update
    @Override
    public GetTaskDto updateTask(UUID id, UpdateTaskDto updateTaskDto) {
        // Find current updated task --> if NOT found throw error
        Task task = taskRepository.findById(id).orElseThrow(EntityNotFoundException::new);
        TaskList taskList = taskListRepository.findById(updateTaskDto.getTaskListId()).orElseThrow((EntityNotFoundException::new));
        task.setTitle(updateTaskDto.getTitle());
        task.setDescription(updateTaskDto.getDescription());
        task.setTaskList(taskList);
        task.setDueDate(updateTaskDto.getDueDate());
        task.setPublic(updateTaskDto.isPublic());
        return TaskMapper.toDto(taskRepository.save(task));
    }

    // FR1: View task by id
    // Input: task id
    // Output: corresponding task's data
    // Business: Not implemented (TODO)
    @Override
    public GetTaskDto getTaskById(UUID id) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        return TaskMapper.toDto(taskOptional.get());
    }


    // FR5: Move task
    // Input: moved task id, Column's id which moved to , Task's id which is moved to before
    // Output: none
    // Business: - if (3)rd param is null --> move task to the last position of column
    //           - With private task: only creator can move
    //           - With public task: only attender can move task
    @Override
    public void updateTaskPosition(UUID id,UUID movedToTaskListId, UUID movedBeforePositionId) {
        // Find moved task --> if NOT found throw error
        Optional<Task> currentTaskOptional = taskRepository.findById(id);
        if (currentTaskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        // Find moved to column --> if NOT found throw error
        Optional<TaskList> movedToTaskListOptional = taskListRepository.findById(movedToTaskListId);
        if (movedToTaskListOptional.isEmpty()) {
            throw new EntityNotFoundException("Task List with id " + movedToTaskListId + " not found");
        }

        // Find task which is moved to before --> if NOT found insert to last position
        Optional<Task> movedBeforeTaskOptional = movedBeforePositionId == null ? Optional.empty() : taskRepository.findById(movedBeforePositionId);

        Task currentTask = currentTaskOptional.get();
        TaskList movedToTaskList = movedToTaskListOptional.get();

        // Move task position algorithm
        // Case 1: moved to position found
        //         1.1 Add (+1) to position of tasks from moved to position
        //         1.2 Insert task to this position (update position to moved to position)
        //         1.3 Update column id if necessary
        // Case 2: moved to position is null
        //         2.1 Get the last position of column
        //         2.2 Insert to last of column (update position)
        //         2.3 Update column id if necessary
        // -------
        // Default added position is 1
        long movedToPosition = 1;

        // Case 1: Check if moved to position is found
        if(movedBeforeTaskOptional.isPresent()){
             movedToPosition = movedBeforeTaskOptional.get().getPosition();
            List<Task> tasks = taskRepository.findByTaskListId(movedToTaskList.getId());

            // 1.1: ...
            for (Task task : tasks) {
                if(task.getPosition() >= movedToPosition && !task.getId().equals(currentTask.getId())){
                    task.setPosition(task.getPosition() + 1);
                }
            }
            taskRepository.saveAll(tasks);
        // Case 2: Moved to position NOT found
        }else{
            // 2.1: ...
            Optional<Task> latestTaskOptional = taskRepository.findFirstByTaskListIdOrderByPositionDesc(movedToTaskList.getId());
            if (latestTaskOptional.isPresent()) {
                movedToPosition = latestTaskOptional.get().getPosition() + 1;
            }
        }

        // 1.2 + 2.2: ...
        currentTask.setPosition(movedToPosition);

        // 1.3: ...
        if (!currentTask.getTaskList().getId().equals(movedToTaskListId)) {
            currentTask.setTaskList(movedToTaskList);
        }

        // Save task to database
        taskRepository.save(currentTask);
    }

    // FR4: Take task
    // Input: Task id
    // Output: none
    // Business: - With public task:
    //              + Task can only be taken when in 'To do' column and with no attender
    //              + Task when be taken update attender and moved to "In progress" column
    //           - With private task: (disabled this option)
    @Override
    public void takeTask(UUID id) {

        // Check current user --> if NOT throw error
        Optional<User> currentUser = customUserDetailService.getCurrentUser();
        if (currentUser.isEmpty()) {
            throw new EntityNotFoundException("User not logged in");
        }

        // Find task --> if NOT throw error
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        // Check task status --> if private throw error
        if(!taskOptional.get().isPublic()){
            throw new UnsupportedOperationException("Take private task is disabled");
        }

        // Check task is in "To do" column --> if NOT throw error
        if(!taskOptional.get().getTaskList().getName().equals("To do")){
            throw new UnsupportedOperationException("Task can only be taken when in To do column");
        }

        //  Check attender --> if found throw error
        if(taskOptional.get().getAttender() != null){
            throw new UnsupportedOperationException("Task is already taken by user id: " + taskOptional.get().getAttender().getId());
        }
        Optional<TaskList> inProgressTaskListOptional = taskListRepository.findByName("In progress");

        // Find "In progress" column --> if NOT found throw error
        if(inProgressTaskListOptional.isEmpty()){
            throw new EntityNotFoundException("TaskList with title " + "In Progress" + " not found");
        }

        // Set attender
        taskOptional.get().setAttender(currentUser.get());
        // Move to "In progress" column
        taskOptional.get().setTaskList(inProgressTaskListOptional.get());
        // Save to database
        taskRepository.save((taskOptional.get()));
    }

    // FR6: Cancel task
    // Input: Task id
    // Output: None
    // Business: - Attender can cancel / if not creator can cancel task
    //           - Task when canceled remove attender and moved to "Cancel" column
    @Override
    public void cancelTask(UUID id) {
        // Check current user --> if NOT throw error
        Optional<User> currentUser = customUserDetailService.getCurrentUser();
        if (currentUser.isEmpty()) {
            throw new EntityNotFoundException("User not logged in");
        }

        // Find task --> if NOT throw error
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            throw new EntityNotFoundException("Task with id " + id + " not found");
        }

        // Check if task has attender and current user is NOT attender --> throw error
        if(taskOptional.get().getAttender() != null && !currentUser.get().getId().equals(taskOptional.get().getAttender().getId())){
            throw new UnsupportedOperationException("Only attender can cancel task");
        }
        // Check if task has NO attender and current user is NOT creator --> throw error
        if(taskOptional.get().getAttender() == null && !currentUser.get().getId().equals(taskOptional.get().getCreatedBy().getId()) ){
            throw new UnsupportedOperationException("Only creator can cancel task");
        }

        // Find "Cancel" column --> if NOT throw error
        Optional<TaskList> cancelTaskListOptional = taskListRepository.findByName("Cancel");
        if(cancelTaskListOptional.isEmpty()){
            throw new EntityNotFoundException("TaskList with title " + "In Progress" + " not found");
        }

        // Move to cancel task list
        taskOptional.get().setTaskList(cancelTaskListOptional.get());

        // Remove attender
        taskOptional.get().setAttender(null);

        // Save to db
        taskRepository.save((taskOptional.get()));
    }
}


