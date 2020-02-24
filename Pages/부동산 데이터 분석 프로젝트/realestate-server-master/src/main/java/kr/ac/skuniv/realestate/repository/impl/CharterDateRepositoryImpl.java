package kr.ac.skuniv.realestate.repository.impl;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import kr.ac.skuniv.realestate.aop.AspectExceptionAnnotation;
import kr.ac.skuniv.realestate.domain.dto.*;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphTmpDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.RegionDto;
import kr.ac.skuniv.realestate.domain.dto.searchDto.SearchReqDto;
import kr.ac.skuniv.realestate.domain.entity.CharterDate;
import kr.ac.skuniv.realestate.domain.entity.QBuilding;
import kr.ac.skuniv.realestate.repository.custom.CharterDateRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

import static kr.ac.skuniv.realestate.domain.entity.QCharterDate.charterDate;

/**
 * Created by youngman on 2019-01-16.
 */

@SuppressWarnings("Duplicates")
@Component
public class CharterDateRepositoryImpl extends QuerydslRepositorySupport implements CharterDateRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;
    private QBuilding building = QBuilding.building;

    public CharterDateRepositoryImpl() {
        super(CharterDate.class);
    }

    @Override
    @AspectExceptionAnnotation
    public List<GraphTmpDto> getByRegionDtoAndDateDto(RegionDto regionDto, DateDto dateDto) {
        JPAQuery<GraphTmpDto> jpaQuery = new JPAQuery<>(entityManager);
        jpaQuery = setQuery(jpaQuery);
        jpaQuery = setQueryByRegionDto(jpaQuery, regionDto);
        jpaQuery = setQueryByDateDto(jpaQuery, dateDto);

        return jpaQuery.fetch();
    }

    private JPAQuery<GraphTmpDto> setQuery(JPAQuery<GraphTmpDto> query) {
        return query.select(Projections.constructor(GraphTmpDto.class, building.type, charterDate.date, charterDate.price.avg()))
                .from(charterDate)
                .join(charterDate.building, building);
    }

    private JPAQuery<GraphTmpDto> setQueryByRegionDto(JPAQuery<GraphTmpDto> query, RegionDto regionDto) {

        if (regionDto.getRegionType() == RegionDto.RegionType.CITY) {
            query.where(building.city.eq(regionDto.getCityCode()));
        } else if (regionDto.getRegionType() == RegionDto.RegionType.DISTRICT) {
            query.where(building.city.eq(regionDto.getCityCode()), building.groop.eq(regionDto.getGroopCode()));
        } else if (regionDto.getRegionType() == RegionDto.RegionType.NEIGHBORHOOD) {
            query.where(
                    building.city.eq(regionDto.getCityCode()),
                    building.groop.eq(regionDto.getGroopCode()));
//                    building.dong.contains(regionDto.getDongName()));
        }

        return query;
    }

    private JPAQuery<GraphTmpDto> setQueryByDateDto(JPAQuery<GraphTmpDto> query, DateDto dateDto) {

        if (dateDto.getDateType() == DateDto.DateType.YEAR) {
            query.groupBy(building.type, charterDate.date.year());
        } else if (dateDto.getDateType() == DateDto.DateType.MONTH) {
            query.where(charterDate.date.year().eq(dateDto.getLocalDate().getYear()))
                    .groupBy(building.type, charterDate.date.month());
        } else if (dateDto.getDateType() == DateDto.DateType.DAY) {
            query.where(charterDate.date.year().eq(dateDto.getLocalDate().getYear()),
                    charterDate.date.month().eq(dateDto.getLocalDate().getMonthValue()))
                    .groupBy(building.type, charterDate.date);
        }

        return query;
    }

    @Override
    @AspectExceptionAnnotation
    public List<CharterDate> getBuildingByAddressAndHousingType(SearchReqDto searchReqDto) {
        JPAQuery<CharterDate> jpaQuery = new JPAQuery<>(entityManager);
        jpaQuery = setSearchQuery(jpaQuery, searchReqDto);
        return jpaQuery.fetch();
    }

    private JPAQuery<CharterDate> setSearchQuery(JPAQuery<CharterDate> query, SearchReqDto searchReqDto) {
        return query
                .from(charterDate)
                .join(charterDate.building, building)
                .where(building.dong.contains(searchReqDto.getAddress())
                        .and(building.type.eq(String.valueOf(searchReqDto.getHousingType()).toLowerCase()))).orderBy(charterDate.price.desc())
                .offset((searchReqDto.getPaging() - 1) * 10)
                .limit(10);
    }
}
