package kr.ac.skuniv.realestate.repository;

import kr.ac.skuniv.realestate.domain.entity.CharterDate;
import kr.ac.skuniv.realestate.repository.custom.CharterDateRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CharterDateRepository extends JpaRepository<CharterDate, Long>, CharterDateRepositoryCustom {
}
