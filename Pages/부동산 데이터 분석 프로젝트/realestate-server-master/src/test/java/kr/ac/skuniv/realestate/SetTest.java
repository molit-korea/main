package kr.ac.skuniv.realestate;

import org.junit.Test;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class SetTest {

    @Test
    public void setTest(){
        List<Dto> dtos = new ArrayList<>();
        for(int i = 0 ; i < 5 ; i++) {
            dtos.add(new Dto("박춘소", "cnsth123"));
            dtos.add(new Dto("이영준", "cnsth123"));
            dtos.add(new Dto("김윤상", "dbstkd123"));
        }

        Set<Dto> dtoSet = new HashSet<>();
        dtoSet.addAll(dtos);
        for(int i = 0 ; i < dtoSet.size() ; i++){
            System.out.println(dtoSet.toArray()[i].toString());
        }
        System.out.println(dtoSet.size());
    }

    class Dto{
        private String name;
        private String email;

        public Dto(String name, String email) {
            this.name = name;
            this.email = email;
        }

        @Override
        public String toString() {
            return "name: " + name + " email: " + email;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }
}
