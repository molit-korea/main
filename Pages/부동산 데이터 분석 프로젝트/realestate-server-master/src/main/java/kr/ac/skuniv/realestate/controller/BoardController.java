package kr.ac.skuniv.realestate.controller;

import io.swagger.annotations.ApiOperation;
import kr.ac.skuniv.realestate.domain.dto.boardDto.AnswerSaveDto;
import kr.ac.skuniv.realestate.domain.dto.boardDto.AnswerUpdateDto;
import kr.ac.skuniv.realestate.domain.dto.boardDto.BoardSaveDto;
import kr.ac.skuniv.realestate.domain.dto.boardDto.BoardUpdateDto;
import kr.ac.skuniv.realestate.domain.entity.Answer;
import kr.ac.skuniv.realestate.domain.entity.Board;
import kr.ac.skuniv.realestate.service.BoardService;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by YoungMan on 2019-02-16.
 */

@RestController
@RequestMapping(value = "/realestate/board")
@Log4j2
@CrossOrigin
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @ApiOperation("페이지에 따른 게시판글")
    @GetMapping("/city/{city}/district/{district}/page/{page}")
    public List<Board> getBoardsByPage(@PathVariable String city, @PathVariable String district, @PathVariable int page) {
        return boardService.getBoardsByPage(city, district, page);
    }

    @ApiOperation("게시판 저장")
    @PostMapping
    public List<Board> saveBoard(@RequestBody BoardSaveDto boardSaveDto) {
        boardService.saveBoard(boardSaveDto);
        List<Board> boardsByPage = boardService.getBoardsByPage(boardSaveDto.getCity(), boardSaveDto.getDistrict(), 1);

        log.warn(boardsByPage.size());

        return boardsByPage;
    }

    @ApiOperation("댓글 저장")
    @PostMapping("/answer")
    public Board saveAnswer(@RequestBody AnswerSaveDto answerSaveDto) {
        log.warn(answerSaveDto.toString());
        return boardService.saveAnswer(answerSaveDto);
    }

}