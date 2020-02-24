package kr.ac.skuniv.realestate.repository.impl;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import kr.ac.skuniv.realestate.aop.AspectExceptionAnnotation;
import kr.ac.skuniv.realestate.domain.dto.*;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphTmpDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.RegionDto;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchReqDto;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchResDto;
import kr.ac.skuniv.realestate.domain.entity.BargainDate;
import kr.ac.skuniv.realestate.domain.entity.QBuilding;
import kr.ac.skuniv.realestate.repository.custom.BargainDateRepositoryCustom;
import lombok.extern.java.Log;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

import static kr.ac.skuniv.realestate.domain.entity.QBargainDate.bargainDate;

/**
 * Created by youngman on 2019-01-16.
 */

@SuppressWarnings("Duplicates")
@Component
@Log
public class BargainDateRepositoryImpl extends QuerydslRepositorySupport implements BargainDateRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;
    private QBuilding building = QBuilding.building;


    public BargainDateRepositoryImpl() {
        super(BargainDate.class);
    }

    @Override
    @AspectExceptionAnnotation
    public List<GraphTmpDto> getByRegionDtoAndDateDto(RegionDto regionDto, DateDto dateDto) {
        JPAQuery<GraphTmpDto> jpaQuery = new JPAQuery<>(entityManager);
        jpaQuery = setGraphQuery(jpaQuery);
        jpaQuery = setGraphQueryByRegionDto(jpaQuery, regionDto);
        jpaQuery = setGraphQueryByDateDto(jpaQuery, dateDto);

        return jpaQuery.fetch();
    }

    private JPAQuery<GraphTmpDto> setGraphQuery(JPAQuery<GraphTmpDto> query) {
        return query.select(Projections.constructor(GraphTmpDto.class, building.type, bargainDate.date, bargainDate.price.avg()))
                .from(bargainDate)
                .join(bargainDate.building, building);
    }

    private JPAQuery<GraphTmpDto> setGraphQueryByRegionDto(JPAQuery<GraphTmpDto> query, RegionDto regionDto) {

        if (regionDto.getRegionType() == RegionDto.RegionType.CITY) {
            query.where(building.city.eq(regionDto.getCityCode()));
        } else if (regionDto.getRegionType() == RegionDto.RegionType.DISTRICT) {
            query.where(building.city.eq(regionDto.getCityCode()), building.groop.eq(regionDto.getGroopCode()));
        } else if (regionDto.getRegionType() == RegionDto.RegionType.NEIGHBORHOOD) {
            query.where(building.city.eq(regionDto.getCityCode()), building.groop.eq(regionDto.getGroopCode()), building.dong.contains(regionDto.getDongName()));
        }

        return query;
    }

    private JPAQuery<GraphTmpDto> setGraphQueryByDateDto(JPAQuery<GraphTmpDto> query, DateDto dateDto) {

        if (dateDto.getDateType() == DateDto.DateType.YEAR) {
            query.groupBy(building.type, bargainDate.date.year());
        } else if (dateDto.getDateType() == DateDto.DateType.MONTH) {//연도 같고 월별로
            query.where(bargainDate.date.year().eq(dateDto.getLocalDate().getYear()))
                    .groupBy(building.type, bargainDate.date.month());
        } else if (dateDto.getDateType() == DateDto.DateType.DAY) {//월 같고 날짜별로
            query.where(bargainDate.date.year().eq(dateDto.getLocalDate().getYear()), bargainDate.date.month().eq(dateDto.getLocalDate().getMonthValue()))
                    .groupBy(building.type, bargainDate.date);
        }

        return query;
    }

    @Override
    @AspectExceptionAnnotation
    public List<BargainDate> getBuildingByAddressAndHousingType(SearchReqDto searchReqDto) {
        JPAQuery<BargainDate> jpaQuery = new JPAQuery<>(entityManager);
        jpaQuery = setSearchQuery(jpaQuery, searchReqDto);
        return jpaQuery.fetch();
    }

    private JPAQuery<BargainDate> setSearchQuery(JPAQuery<BargainDate> query, SearchReqDto searchReqDto) {
        return query
                .from(bargainDate)
                .join(bargainDate.building, building)
                .where(building.dong.contains(searchReqDto.getAddress())
                        .and(building.type.eq(String.valueOf(searchReqDto.getHousingType()).toLowerCase()))).orderBy(bargainDate.price.desc())
                .offset((searchReqDto.getPaging() - 1) * 10)
                .limit(10);
    }
}