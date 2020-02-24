package kr.ac.skuniv.realestate.controller;

import io.swagger.annotations.ApiOperation;
import kr.ac.skuniv.realestate.domain.dto.DateDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.RegionDto;
import kr.ac.skuniv.realestate.repository.RegionCodeRepository;
import kr.ac.skuniv.realestate.service.GraphService;
import kr.ac.skuniv.realestate.utill.RegionCodeConverter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/realestate/graph")
public class GraphController {

    private GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @Autowired
    RegionCodeRepository regionCodeRepository;

    private Logger logger = LoggerFactory.getLogger(GraphController.class);

    @ApiOperation("날짜없이 대코드 조회")
    @GetMapping("/city/{city}")
    public List<GraphDto> onlyCity(@PathVariable String city) {
        RegionDto regionDto = RegionCodeConverter.getCityCode(city);

        DateDto dateDto = DateDto.builder()
                .dateType(DateDto.DateType.YEAR)
                .build();
        return graphService.getGraphDtos(regionDto, dateDto);
    }

    @ApiOperation("날짜와 대코드 조회")
    @GetMapping("/city/{city}/date/{date}")
    public List<GraphDto> cityAndDate(@PathVariable String city, @PathVariable String date) {
        RegionDto regionDto = RegionCodeConverter.getCityCode(city);
        DateDto dateDto = graphService.convertDateToDto(date);

        List<GraphDto> graphDtos = graphService.getGraphDtos(regionDto, dateDto);
        for (GraphDto graphDto : graphDtos) {
            logger.warn(graphDto.toString());
        }
        return graphDtos;
    }

    @ApiOperation("날짜없이 대코드 중코드 조회")
    @GetMapping("/city/{city}/district/{district}")
    public List<GraphDto> cityAndDistrict(@PathVariable String city, @PathVariable String district) {
        RegionDto regionDto = RegionCodeConverter.getCityAndGroopCode(city, district);
        DateDto dateDto = DateDto.builder()
                .dateType(DateDto.DateType.YEAR)
                .build();

        return graphService.getGraphDtos(regionDto, dateDto);
    }

    @ApiOperation("날짜와 대코드 중코드 조회")
    @GetMapping("/city/{city}/district/{district}/date/{date}")
    public List<GraphDto> cityAndDistrictAndDate(@PathVariable String city, @PathVariable String district, @PathVariable String date) {
        RegionDto regionDto = RegionCodeConverter.getCityAndGroopCode(city, district);
        DateDto dateDto = graphService.convertDateToDto(date);

        return graphService.getGraphDtos(regionDto, dateDto);
    }

    @ApiOperation("날짜없이 대코드 중코드 소코드 조회")
    @GetMapping("/city/{city}/district/{district}/neighborhood/{neighborhood}")
    public List<GraphDto> cityAndDistrictAndNeighborhood(@PathVariable String city, @PathVariable String district, @PathVariable String neighborhood) {
        RegionDto regionDto = RegionCodeConverter.getAllCode(city, district, neighborhood);
        DateDto dateDto = DateDto.builder()
                .dateType(DateDto.DateType.YEAR)
                .build();

        return graphService.getGraphDtos(regionDto, dateDto);
    }

    @ApiOperation("날짜와 대코드 중코드 소코드 조회")
    @GetMapping("/city/{city}/district/{district}/neighborhood/{neighborhood}/date/{date}")
    public List<GraphDto> cityAndDistrictAndNeighborhoodAndDate(@PathVariable String city, @PathVariable String district, @PathVariable String neighborhood, @PathVariable String date) {
        RegionDto regionDto = RegionCodeConverter.getAllCode(city, district, neighborhood);
        DateDto dateDto = graphService.convertDateToDto(date);

        return graphService.getGraphDtos(regionDto, dateDto);
    }

    @ApiOperation("날짜없이 대코드 소코드 조회(세종 특별시 경우)")
    @GetMapping("/city/{city}/neighborhood/{neighborhood}")
    public List<GraphDto> cityAndNeighborhood(@PathVariable String city, @PathVariable String neighborhood) {
        RegionDto regionDto = RegionCodeConverter.getAllCode(city, "", neighborhood);
        DateDto dateDto = DateDto.builder()
                .dateType(DateDto.DateType.YEAR)
                .build();

        return graphService.getGraphDtos(regionDto, dateDto);
    }

    @ApiOperation("날짜와 대코드 소코드 조회(세종 특별시 경우)")
    @GetMapping("/city/{city}/neighborhood/{neighborhood}/date/{date}")
    public List<GraphDto> cityAndNeighborhoodAndDate(@PathVariable String city, @PathVariable String neighborhood, @PathVariable String date) {
        RegionDto regionDto = RegionCodeConverter.getAllCode(city, "", neighborhood);
        DateDto dateDto = graphService.convertDateToDto(date);

        return graphService.getGraphDtos(regionDto, dateDto);
    }
}