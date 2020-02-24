package kr.ac.skuniv.realestate.repository;

import kr.ac.skuniv.realestate.domain.entity.RentDate;
import kr.ac.skuniv.realestate.repository.custom.RentDateRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface RentDateRepository extends JpaRepository<RentDate, Long>, RentDateRepositoryCustom {
}
