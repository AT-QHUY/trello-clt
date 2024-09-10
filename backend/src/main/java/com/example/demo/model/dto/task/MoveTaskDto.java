package com.example.demo.model.dto.task;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MoveTaskDto {
    private UUID movedToColumnId = null;
    private UUID movedBeforeTaskId;
}
