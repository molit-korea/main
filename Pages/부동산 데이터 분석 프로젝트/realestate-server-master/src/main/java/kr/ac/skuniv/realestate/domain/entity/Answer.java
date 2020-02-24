package kr.ac.skuniv.realestate.domain.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by YoungMan on 2019-02-16.
 */

@Entity
@Getter
@Setter
@Table(name = "answer")
@ToString
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    private String content;

    private String author;

    @CreationTimestamp
    @Temporal(value = TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date registerDate;

    @UpdateTimestamp
    @Temporal(value = TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Seoul")
    private Date modifyDate;

    @ManyToOne
    @JsonBackReference
    private Board board;

    public Answer() {
    }

    @Builder
    public Answer(String content, String author, Board board) {
        this.content = content;
        this.author = author;
        this.board = board;
    }
}
