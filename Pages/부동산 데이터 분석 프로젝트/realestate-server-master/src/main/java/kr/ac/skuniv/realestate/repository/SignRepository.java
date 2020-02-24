package kr.ac.skuniv.realestate.repository;

import kr.ac.skuniv.realestate.domain.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SignRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);
}
