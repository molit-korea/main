package kr.ac.skuniv.realestate.repository.impl;
import kr.ac.skuniv.realestate.domain.entity.*;
import kr.ac.skuniv.realestate.repository.custom.BuildingRepositoryCustom;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Component
public class BuildingRepositoryImpl extends QuerydslRepositorySupport implements BuildingRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;
    private QBuilding building = QBuilding.building;

    public BuildingRepositoryImpl() {
        super(Building.class);
    }
}