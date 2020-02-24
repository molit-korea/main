package kr.ac.skuniv.realestate.repository.impl;

import com.querydsl.jpa.impl.JPAQuery;
import kr.ac.skuniv.realestate.aop.AspectExceptionAnnotation;
import kr.ac.skuniv.realestate.domain.dto.boardDto.AnswerSaveDto;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphTmpDto;
import kr.ac.skuniv.realestate.domain.entity.Answer;
import kr.ac.skuniv.realestate.domain.entity.Board;
import kr.ac.skuniv.realestate.domain.entity.QBoard;
import kr.ac.skuniv.realestate.repository.custom.BoardRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

import static kr.ac.skuniv.realestate.domain.entity.QCharterDate.charterDate;

@Component
public class BoardRepositoryImpl  extends QuerydslRepositorySupport implements BoardRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;
    private QBoard board = QBoard.board;

    public BoardRepositoryImpl() {
        super(Board.class);
    }


    @Override
    @AspectExceptionAnnotation
    public List<Board> findByAddressAndPage(String city, String district, int page) {
        JPAQuery<Board> jpaQuery = new JPAQuery<>(entityManager);

        jpaQuery.from(board).where(board.city.eq(city).and(board.district.eq(district))).orderBy(board.registerDate.desc())
                .offset((page - 1) * 10)
                .limit(10);
        return jpaQuery.fetch();
    }
}
