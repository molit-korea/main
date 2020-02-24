package kr.ac.skuniv.realestate.domain.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Getter
@Setter
@Table(name = "rent_date")
@NoArgsConstructor
public class RentDate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(value = TemporalType.DATE)
    private Date date;

    @Column(name = "guarantee_price")
    private Integer guaranteePrice;

    @Column(name = "monthly_price")
    private Integer monthlyPrice;

    @ManyToOne(cascade = {CascadeType.ALL}, fetch = FetchType.LAZY)
    @JoinColumn(name = "building_id", insertable = false, updatable = false)
    private Building building;
}
