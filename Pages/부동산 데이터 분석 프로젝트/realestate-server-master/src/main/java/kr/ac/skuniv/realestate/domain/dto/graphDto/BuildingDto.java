package kr.ac.skuniv.realestate.domain.dto.graphDto;

import lombok.*;

@Builder @Setter
@ToString @AllArgsConstructor @NoArgsConstructor
public class BuildingDto {

    // 시
    private int city;
    // 군/구
    private String groop;
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

    // 전세 or 월세 or 매매
    private String dealType;

}
