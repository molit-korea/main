package kr.ac.skuniv.realestate.domain.dto.graphDto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@ToString
public class GraphTmpDto {

    private String dealType;
    private String housingType;
    private Date date;
    private Double average;

    public GraphTmpDto() {
    }

    @QueryProjection
    public GraphTmpDto(String housingType, Date date, Double average) {
        this.housingType = housingType;
        this.date = date;
        this.average = average;
    }

    public GraphTmpDto(String dealType, String housingType, Date date, Double average) {
        this.dealType = dealType;
        this.housingType = housingType;
        this.date = date;
        this.average = average;
    }

    @Override
    public String toString() {
        return "\nGraphTmpDto{" +
                "\n housingType = '" + housingType + '\'' +
                ", \ndate = " + date +
                ", \ndealType = " + dealType +
                ", \naverage = " + average +
                "}\n";
    }
}