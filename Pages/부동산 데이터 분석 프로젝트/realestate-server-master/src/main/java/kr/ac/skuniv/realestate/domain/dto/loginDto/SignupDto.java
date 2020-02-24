package kr.ac.skuniv.realestate.domain.dto.loginDto;

import kr.ac.skuniv.realestate.domain.MemberRole;
import kr.ac.skuniv.realestate.domain.entity.Member;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter @Setter
public class SignupDto {
    private String email;
    private String password;
    private String name;

    public Member toEntity(Set<MemberRole> roles){
        return Member.builder()
                .email(email)
                .password(password)
                .name(name)
                .roles(roles)
                .build();

    }
}
