package com.example.demo.model.dto.tasklist;

import com.example.demo.model.dto.task.GetTaskDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GetTaskListDto {
    private UUID id;
    private String name;
    private List<GetTaskDto> tasks;
}
