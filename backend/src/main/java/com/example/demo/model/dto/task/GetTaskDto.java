package com.example.demo.model.dto.task;

import com.example.demo.model.dto.user.GetUserDto;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Data
@Builder
public class GetTaskDto {
    private UUID id;
    private String title;
    private String description;
    private Date dueDate;
    private Date createdDate;
    private GetUserDto createdBy;
    private Boolean isPublic;
    private UUID columnId;
    private long position;
    private GetUserDto attender;
}
