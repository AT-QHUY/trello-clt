package com.example.demo.repository;

import com.example.demo.model.entity.impl.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    @Query(value = "select t from Task t where (t.createdBy.id = ?1 or t.isPublic = ?2) and t.taskList.id = ?3 and lower(t.title) like lower(concat('%', ?4, '%') ) order by t.position asc ")
    List<Task> findByUserIdOrPublicStatusAndTaskListIdAndTitleOrderByPositionAsc(UUID userID, boolean publicStatus, UUID taskListID, String title);

    @Query(value = "select MAX(t.position) from Task t where t.taskList.id = ?1 and t.isPublic = ?2 ")
    long findLastTaskByTaskListIdAndPublicStatusAnd(UUID taskListId, boolean isPublic);

    List<Task> findByTaskListId(UUID taskListId);

    Optional<Task> findFirstByTaskListIdOrderByPositionDesc(UUID taskListId);


}
