package kr.ac.skuniv.realestate.repository.custom;

import kr.ac.skuniv.realestate.domain.dto.*;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphTmpDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.RegionDto;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchReqDto;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchResDto;
import kr.ac.skuniv.realestate.domain.entity.BargainDate;

import java.util.List;

/**
 * Created by youngman on 2019-01-16.
 */

public interface BargainDateRepositoryCustom {

    List<GraphTmpDto> getByRegionDtoAndDateDto(RegionDto regionDto, DateDto dateDto);

    List<BargainDate> getBuildingByAddressAndHousingType(SearchReqDto searchReqDto);
}
