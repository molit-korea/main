package kr.ac.skuniv.realestate.domain.dto.graphDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Component
@ToString
public class GraphDto {

    private String dealType;
    private String housingType;
    private Map<String, Double> average = new HashMap<>();

    public GraphDto() {

    }

    @Builder
    public GraphDto(String dealType, String housingType, Map<String, Double> average) {
        this.dealType = dealType;
        this.housingType = housingType;
        this.average = average;
    }
}