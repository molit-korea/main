package kr.ac.skuniv.realestate.domain.dto.boardDto;

import lombok.*;

/**
 * Created by YoungMan on 2019-02-19.
 */

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardSaveDto {

    private String city;
    private String district;
    private String title;
    private String content;
    private String author;

}