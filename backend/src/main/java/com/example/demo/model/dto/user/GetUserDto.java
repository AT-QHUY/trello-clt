package com.example.demo.model.dto.user;


import com.example.demo.model.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetUserDto {
    private UUID id;
    private String username;
    private String email;
    private UserRole role;

}
