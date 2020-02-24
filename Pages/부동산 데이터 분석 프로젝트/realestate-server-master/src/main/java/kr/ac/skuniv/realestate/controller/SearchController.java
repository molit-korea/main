package kr.ac.skuniv.realestate.controller;

import io.swagger.annotations.ApiOperation;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchReqDto;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchResDto;
import kr.ac.skuniv.realestate.service.SearchService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by YoungMan on 2019-02-16.
 */

@RestController @Log4j2
@RequestMapping(value = "/realestate/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @ApiOperation("매매 정보 검색")
    @PostMapping()
    public List<SearchResDto> searchBuilding(@RequestBody SearchReqDto searchReqDto){
        List<SearchResDto> searchResDtos = searchService.getBuildingList(searchReqDto);

        log.warn(searchReqDto.getAddress() + "  " + searchReqDto.getDealType() + "  " + searchReqDto.getHousingType() );
        return searchResDtos;
    }
}