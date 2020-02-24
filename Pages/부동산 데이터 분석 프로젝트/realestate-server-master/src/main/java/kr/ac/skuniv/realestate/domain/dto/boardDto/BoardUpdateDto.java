package kr.ac.skuniv.realestate.domain.dto.boardDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by YoungMan on 2019-02-19.
 */

@Getter
@Setter
public class BoardUpdateDto {

    private Long no;
    private String title;
    private String content;
    private String author;

    public BoardUpdateDto() {
    }

    @Builder
    public BoardUpdateDto(Long no, String title, String content, String author) {
        this.no = no;
        this.title = title;
        this.content = content;
        this.author = author;
    }
}
