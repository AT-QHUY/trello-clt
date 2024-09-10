package com.example.demo.model.entity.impl;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;


@Entity
@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class TaskList {
    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid", updatable = false)
    private UUID id;

    private String name;

    @OneToMany(mappedBy = "taskList")
    private List<Task> tasks;

}
