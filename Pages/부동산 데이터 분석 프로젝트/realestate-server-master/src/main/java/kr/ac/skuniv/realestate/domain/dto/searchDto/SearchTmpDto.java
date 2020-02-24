package kr.ac.skuniv.realestate.domain.dto.searchDto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;

@Getter @Setter @ToString @AllArgsConstructor
public class SearchTmpDto {
    private Long buildingNo;

    private int city;

    private int groop;

    private String dong;

    private String name;

    private Double area;

    private int floor;

    private String dealType;

    private String housingType;

    private String buildingNum;

    private String constructYear;

    private Double price;

    private Double monthly;

    private Date date;

    private BigDecimal latitude;

    private BigDecimal longitude;

    @QueryProjection
    public SearchTmpDto(Long buildingNo, int city, int groop, String dong, String name, Double area, int floor, String housingType, String buildingNum, String constructYear, Double price,  Date date, BigDecimal latitude, BigDecimal longitude){
        this.buildingNo = buildingNo;
        this.city = city;
        this.groop = groop;
        this.dong = dong;
        this.name = name;
        this.area = area;
        this.floor = floor;
        this.housingType = housingType;
        this.buildingNum = buildingNum;
        this.constructYear = constructYear;
        this.price = price;
        this.date = date;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public SearchTmpDto() {

    }
}