package kr.ac.skuniv.realestate;

import kr.ac.skuniv.realestate.aop.AspectException;
import kr.ac.skuniv.realestate.domain.entity.RegionCode;
import kr.ac.skuniv.realestate.repository.RegionCodeRepository;
import kr.ac.skuniv.realestate.service.GraphService;
import kr.ac.skuniv.realestate.utill.ExcelConverterUtill;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class RealestateRunner implements ApplicationRunner {

    private final Logger logger = LoggerFactory.getLogger(RealestateRunner.class);
    private final DataSource dataSource;
    private final ExcelConverterUtill excelConverterUtill;
    private final GraphService graphService;
    private final RegionCodeRepository regionCodeRepository;

    @Autowired
    private AspectException aspectException;

    public RealestateRunner(DataSource dataSource, ExcelConverterUtill excelConverterUtill, GraphService graphService, RegionCodeRepository regionCodeRepository) {
        this.dataSource = dataSource;
        this.excelConverterUtill = excelConverterUtill;
        this.graphService = graphService;
        this.regionCodeRepository = regionCodeRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        try (Connection connection = dataSource.getConnection()) {
            logger.info("get URL : " + connection.getMetaData().getURL());
            logger.info(connection.getMetaData().getUserName());
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }
}