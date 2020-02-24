package kr.ac.skuniv.realestate.domain.dto.searchDto;

import com.querydsl.core.annotations.QueryProjection;
import com.querydsl.core.types.dsl.StringPath;
import kr.ac.skuniv.realestate.domain.entity.Building;
import lombok.*;

import java.math.BigDecimal;
import java.util.Date;

@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class SearchResDto {

    // 시
//    private String city;
    // 군/구
    private String address;
    // 동
    private String dong;
    // 건물 이름
    private String name;
    // 면적
    private double area;
    //층
    private int floor;

    // (아파트 or 오피스텔 or 주택)
    private String type;
    //
    private String buildingNum;
    // 건축년도
    private String constructorYear;

    // 최신 거래 가격
    private Integer price;
    // 보증금
    private Integer deposit;
    // 전세 or 월세 or 매매
    private Integer dealType;

    private Date date;

    @QueryProjection
    public SearchResDto(String dong, String name, double area, int floor, String type, String buildingNum, String constructorYear, Integer price, Integer dealType, Date date) {
        this.dong = dong;
        this.name = name;
        this.area = area;
        this.floor = floor;
        this.type = type;
        this.buildingNum = buildingNum;
        this.constructorYear = constructorYear;
        this.price = price;
        this.dealType = dealType;
        this.date = date;
    }
}
