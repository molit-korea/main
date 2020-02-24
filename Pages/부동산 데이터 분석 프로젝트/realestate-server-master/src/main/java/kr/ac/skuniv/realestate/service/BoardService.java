package kr.ac.skuniv.realestate.service;

import kr.ac.skuniv.realestate.domain.dto.boardDto.*;
import kr.ac.skuniv.realestate.domain.entity.Answer;
import kr.ac.skuniv.realestate.domain.entity.Board;
import kr.ac.skuniv.realestate.exception.UserDefineException;
import kr.ac.skuniv.realestate.repository.AnswerRepository;
import kr.ac.skuniv.realestate.repository.BoardRepository;
import kr.ac.skuniv.realestate.repository.impl.BoardRepositoryImpl;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Created by YoungMan on 2019-02-16.
 */

@Service @Log4j2
public class BoardService {

    private final BoardRepository boardRepository;
    private final AnswerRepository answerRepository;

    public BoardService(BoardRepository boardRepository, AnswerRepository answerRepository) {
        this.boardRepository = boardRepository;
        this.answerRepository = answerRepository;
    }

    public List<Board> getBoardsByPage(String city, String district, Integer page) {
        List<Board> boards = boardRepository.findByAddressAndPage(city, district, page);
        log.info("============get board size : " + boards.size() );
        return boards;
    }

    public Board saveBoard(BoardSaveDto boardSaveDto) {
        return boardRepository.save(convertDtoToSaveBoard(boardSaveDto));
    }

    public Board saveAnswer(AnswerSaveDto answerSaveDto) {

        Answer answer = buildAnswer(answerSaveDto);

        Board board = boardRepository.findById(answerSaveDto.getBoardNo()).get();

        answer.setBoard(board);

        answerRepository.save(answer);

        board.getAnswers().add(answer);

        return board;
    }

    private Answer buildAnswer(AnswerSaveDto answerSaveDto) {
        return Answer.builder().author(answerSaveDto.getAuthor()).content(answerSaveDto.getContent()).build();
    }

    private Board convertDtoToSaveBoard(BoardSaveDto boardSaveDto) {
        return Board.builder()
                .title(boardSaveDto.getTitle())
                .content(boardSaveDto.getContent())
                .author(boardSaveDto.getAuthor())
                .city(boardSaveDto.getCity())
                .district(boardSaveDto.getDistrict())
                .build();
    }
}
