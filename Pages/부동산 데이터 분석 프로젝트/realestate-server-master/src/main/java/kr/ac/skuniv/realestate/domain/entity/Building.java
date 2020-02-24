package kr.ac.skuniv.realestate.domain.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name = "building_entity")
@NoArgsConstructor
public class Building {

    @Id
    @Column(name = "id")
    private Long buildingNo;

    private Double area;

    private String buildingNum;

    private int city;

    private int groop;

    private String dong;

    private String constructYear;

    private int floor;

    private String name;

    private String type;

    @OneToMany(mappedBy = "building")
    private List<BargainDate> bargainDates = new ArrayList<>();

    @OneToMany(mappedBy = "building")
    private List<CharterDate> charterDates = new ArrayList<>();

    @OneToMany(mappedBy = "building")
    private List<RentDate> rentDates = new ArrayList<>();

}

