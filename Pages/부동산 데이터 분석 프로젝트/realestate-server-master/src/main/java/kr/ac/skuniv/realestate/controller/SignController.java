package kr.ac.skuniv.realestate.controller;

import io.swagger.annotations.ApiOperation;
import kr.ac.skuniv.realestate.domain.MemberRole;
import kr.ac.skuniv.realestate.domain.dto.loginDto.JwtRequest;
import kr.ac.skuniv.realestate.domain.dto.loginDto.JwtResponse;
import kr.ac.skuniv.realestate.domain.dto.loginDto.SignupDto;
import kr.ac.skuniv.realestate.domain.entity.Member;
import kr.ac.skuniv.realestate.jwtConfig.JwtTokenUtil;
import kr.ac.skuniv.realestate.service.SignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/realestate/sign")
@CrossOrigin
//@RequiredArgsConstructor
public class SignController {
    @Autowired
    private SignService signService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @ApiOperation("로그인")
    @PostMapping
    public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest jwtRequest) throws Exception {

        authenticate(jwtRequest.getUserId() , jwtRequest.getPassword());

        final UserDetails userDetails = signService.loadUserByUsername(jwtRequest.getUserId());

        final String token = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.ok(new JwtResponse(token));
    }

    @ApiOperation("일반 사용자 회원가입")
    @PostMapping("/client")
    public Member clientSignUp(@RequestBody SignupDto signUpDto) {
        return signService.saveMember(signUpDto, MemberRole.USER.name());
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED", e);
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS", e);
        }
    }
}