package kr.ac.skuniv.realestate.config;

import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import kr.ac.skuniv.realestate.domain.dto.graphDto.GraphTmpDto;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

/**
 * Created by YoungMan on 2019-02-23.
 */

@Configuration
public class QueryDslConfig {

    @PersistenceContext
    private EntityManager entityManager;

    @Bean
    public JPAQueryFactory jpaQueryFactory() {
        return new JPAQueryFactory(entityManager);
    }

    @Bean
    public JPAQuery<GraphTmpDto> jpaQuery() {
        return new JPAQuery<>(entityManager);
    }
}
