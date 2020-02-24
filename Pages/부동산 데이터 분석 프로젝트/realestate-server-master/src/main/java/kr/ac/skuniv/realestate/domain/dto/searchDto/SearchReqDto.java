package kr.ac.skuniv.realestate.domain.dto.searchDto;

import lombok.*;

import java.util.List;

@Getter @Setter @Builder @AllArgsConstructor @NoArgsConstructor
public class SearchReqDto {
    private String dealType;

    private String housingType;

    private String address;

    private int paging;

    @ToString
    public enum DealType {
        LEASE, DEAL, MONTH
    }

    @ToString
    public enum HousingType{
        APART, OPPICETEL, HOUSE
    }


}
