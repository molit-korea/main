package kr.ac.skuniv.realestate.domain.dto.graphDto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegionDto {

    private int cityCode;
    private int groopCode;
    private String dongName;
    private RegionType regionType;
    private String code;
    private Boolean hasDong;

    public enum RegionType {
        CITY("대코드"), DISTRICT("중코드"), NEIGHBORHOOD("소코드");

        private String explain;

        RegionType(String explain) {
            this.explain = explain;
        }

        public String getExplain() {
            return explain;
        }
    }
}
