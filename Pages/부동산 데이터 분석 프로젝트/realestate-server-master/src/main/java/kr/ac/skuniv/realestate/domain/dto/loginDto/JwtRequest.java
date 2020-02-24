package kr.ac.skuniv.realestate.domain.dto.loginDto;

import lombok.Data;

@Data
public class JwtRequest {
    private static final long serialVersionUID = 5926468583005150707L;

    private String userId;
    private String password;
}
