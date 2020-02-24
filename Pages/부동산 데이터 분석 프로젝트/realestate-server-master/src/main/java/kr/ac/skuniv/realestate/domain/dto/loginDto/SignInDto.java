package kr.ac.skuniv.realestate.domain.dto.loginDto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignInDto {
    private String email;
    private String password;
}
