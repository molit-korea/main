package kr.ac.skuniv.realestate.repository;


import kr.ac.skuniv.realestate.domain.entity.RegionCode;
import lombok.extern.log4j.Log4j2;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

@RunWith(SpringRunner.class)
@SpringBootTest
@Log4j2
public class RegionCodeRepositoryTest {

    @Autowired
    RegionCodeRepository regionCodeRepository;

    @Test
    public void RegionCodeSelectTest() {
        Optional<RegionCode> keys = regionCodeRepository.findById("서울특별시");

        log.warn(keys.get().getValue());

        Optional<RegionCode> byId = regionCodeRepository.findById("1100000000");

        log.warn(byId.get().getValue());
    }
}
