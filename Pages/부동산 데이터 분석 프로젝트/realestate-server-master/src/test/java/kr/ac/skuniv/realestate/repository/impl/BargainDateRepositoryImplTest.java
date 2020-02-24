package kr.ac.skuniv.realestate.repository.impl;

import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchReqDto;
import kr.ac.skuniv.realestate.domain.entity.BargainDate;
import lombok.extern.log4j.Log4j2;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RunWith(SpringRunner.class)
@SpringBootTest
@Log4j2
public class BargainDateRepositoryImplTest{

    @Autowired
    private BargainDateRepositoryImpl bargainDateRepository;

    @Test
    @Transactional
    public void test() {

        SearchReqDto searchReqDto = SearchReqDto.builder().address("고잔동").housingType("apart").paging(1).build();

        //List<SearchResDto> buildingByAddressAndHousingType = bargainDateRepository.getBuildingByAddressAndHousingType(searchReqDto);

        List<BargainDate> buildingByAddressAndHousingType = bargainDateRepository.getBuildingByAddressAndHousingType(searchReqDto);
        log.warn(buildingByAddressAndHousingType.get(0).getBuilding().getArea());

        //log.warn(buildingByAddressAndHousingType.size());

//        buildingByAddressAndHousingType.forEach(building -> {
//            log.warn(building.toString());
//        });

    }

}