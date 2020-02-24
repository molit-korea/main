package kr.ac.skuniv.realestate.domain.dto.boardDto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * Created by YoungMan on 2019-02-19.
 */

@Getter
@Setter
public class AnswerUpdateDto {

    private Long no;
    private String content;
    private String author;
    private Long boardNo;

    public AnswerUpdateDto() {
    }

    @Builder
    public AnswerUpdateDto(Long no, String content, String author, Long boardNo) {
        this.no = no;
        this.content = content;
        this.author = author;
        this.boardNo = boardNo;
    }
}
