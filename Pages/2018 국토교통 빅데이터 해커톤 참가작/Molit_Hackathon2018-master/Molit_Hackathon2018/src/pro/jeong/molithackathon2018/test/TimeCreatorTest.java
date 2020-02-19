package pro.jeong.molithackathon2018.test;

import pro.jeong.molithackathon2018.utils.Generators;

import java.util.ArrayList;

public class TimeCreatorTest {
    public static void main(String[] ar) {
        String from = "15300300";
        String to = "15400000";
        ArrayList<String> generatedTime = Generators.generateTime(from, to);
        for(int i = 0; i < generatedTime.size(); i++) {
            System.out.println(generatedTime.get(i));
        }
    }
}
