package com.example.demo.model.dto.task;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateTaskDto {
    private String title;
    private String description;
    @JsonProperty
    private boolean isPublic;
    private Date dueDate;
    private UUID taskListId;
    private long position;
}
