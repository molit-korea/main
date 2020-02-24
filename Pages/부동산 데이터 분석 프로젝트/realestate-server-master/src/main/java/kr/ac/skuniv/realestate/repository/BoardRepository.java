package kr.ac.skuniv.realestate.repository;

import kr.ac.skuniv.realestate.domain.entity.Board;
import kr.ac.skuniv.realestate.repository.custom.BoardRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Created by YoungMan on 2019-02-18.
 */

public interface BoardRepository extends JpaRepository<Board,Long>, BoardRepositoryCustom {

    List<Board> findByTitle(@Param("title") String title);

    @Query("select b from Board b where b.title like concat('%',:title,'%') order by b.no desc")
    List<Board> getBoardsByTitle(@Param("title") String title);
}
