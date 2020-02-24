package kr.ac.skuniv.realestate.repository;

import kr.ac.skuniv.realestate.domain.entity.BargainDate;
import kr.ac.skuniv.realestate.repository.custom.BargainDateRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BargainDateRepository extends JpaRepository<BargainDate, Long>, BargainDateRepositoryCustom {



}