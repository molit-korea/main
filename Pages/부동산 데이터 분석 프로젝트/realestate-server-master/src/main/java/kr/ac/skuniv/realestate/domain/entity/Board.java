package kr.ac.skuniv.realestate.domain.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import kr.ac.skuniv.realestate.domain.entity.Answer;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by YoungMan on 2019-02-16.
 */

@Entity
@Getter
@Setter
@Table(name = "board")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    private String title;

    private String content;

    private String author;

    private String city;

    private String district;

    @CreationTimestamp
    @Temporal(value = TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date registerDate;

    @UpdateTimestamp
    @Temporal(value = TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date modifyDate;

    @OneToMany(mappedBy = "board", cascade = {CascadeType.REMOVE}, fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<Answer> answers = new ArrayList<>();

    @Override
    public String toString() {
        return "Board{" +
                "no=" + no +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", author='" + author + '\'' +
                ", registerDate=" + registerDate +
                ", modifyDate=" + modifyDate +
                ", answers=" + answers +
                '}';
    }
}
