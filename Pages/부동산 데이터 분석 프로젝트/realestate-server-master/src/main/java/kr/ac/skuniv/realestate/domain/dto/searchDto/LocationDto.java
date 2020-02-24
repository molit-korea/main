package kr.ac.skuniv.realestate.domain.dto.searchDto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class LocationDto {
    private BigDecimal latitude;
    private BigDecimal longitude;
}
