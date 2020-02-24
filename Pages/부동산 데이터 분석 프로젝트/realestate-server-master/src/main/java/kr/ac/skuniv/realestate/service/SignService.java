package kr.ac.skuniv.realestate.service;

import kr.ac.skuniv.realestate.domain.MemberRole;
import kr.ac.skuniv.realestate.domain.dto.loginDto.SignupDto;
import kr.ac.skuniv.realestate.domain.entity.Member;
import kr.ac.skuniv.realestate.exception.UserDefineException;
import kr.ac.skuniv.realestate.repository.SignRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class SignService implements UserDetailsService {

    @Autowired
    private SignRepository signRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Member member = signRepository.findByEmail(username)
                .orElseThrow(() -> new UserDefineException("아이디를 잘못 입력하셨습니다."));
        return new User(member.getEmail(), member.getPassword(), authorities(member.getRoles()));
    }

    private Collection<? extends GrantedAuthority> authorities(Set<MemberRole> roles) {
        return roles.stream()
                .map(r -> new SimpleGrantedAuthority("ROLE" + r.name()))
                .collect(Collectors.toSet());
    }
    public Member saveMember(SignupDto signupDto, String who){
        signupDto.setPassword(passwordEncoder.encode(signupDto.getPassword()));
        if(signRepository.findByEmail(signupDto.getEmail()).isPresent())
            throw new UserDefineException("이미 존재하는 회원입니다.");

//        Member member;
        if(who.equals(MemberRole.ADMIN.name()))
            return signRepository.save(
                    signupDto.toEntity(
                            Stream.of(MemberRole.ADMIN, MemberRole.USER).collect(Collectors.toSet())
                    )
            );
        else {
            return signRepository.save(
                    signupDto.toEntity(
                            Stream.of(MemberRole.USER).collect(Collectors.toSet())
                    )
            );
        }
    }
}
