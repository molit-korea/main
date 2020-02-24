package kr.ac.skuniv.realestate.repository;

import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchReqDto;
import kr.ac.skuniv.realestate.domain.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Long> {
    @Query(value = "select building from Building building where building.dong like concat('%', :#{#searchReqDto.address}, '%') ")
    List<Building> searchBuildingTest(@Param(value = "searchReqDto") SearchReqDto searchReqDto);
}