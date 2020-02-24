package kr.ac.skuniv.realestate.domain.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;

/**
 * Created by YoungMan on 2019-01-19.
 */

@Getter
@Setter
@ToString
public class DateDto {

    private LocalDate localDate;
    private DateType dateType;

    @Builder
    public DateDto(LocalDate localDate, DateType dateType) {
        this.localDate = localDate;
        this.dateType = dateType;
    }

    public enum DateType {
        YEAR("년"), MONTH("월"), DAY("일");

        private String explain;

        DateType(String explain) {
            this.explain = explain;
        }

        public String getExplain() {
            return explain;
        }
    }
}
