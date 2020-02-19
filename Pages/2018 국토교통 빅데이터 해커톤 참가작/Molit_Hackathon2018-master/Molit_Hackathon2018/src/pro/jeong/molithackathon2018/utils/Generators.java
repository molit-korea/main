package pro.jeong.molithackathon2018.utils;

import java.util.ArrayList;

public class Generators {
    public static ArrayList<String> generateTime(String from, String to) {
        ArrayList<String> time = new ArrayList<>();
        int toGenerate = 0;
        try {
            int fromInt = Integer.parseInt(from);
            int toInt = Integer.parseInt(to);
            System.out.println("from Float : " + fromInt);
            System.out.println("to Float : " + toInt);
            toGenerate = (toInt - fromInt) / 100;
            System.out.println("TO GENERATE : " + toGenerate);
            int t = fromInt;
            for(int i = 0; i < toGenerate; i++) {
                if(t == toInt) {
                    break;
                }
                if(String.valueOf(t).equals("23595900")) {
                    t = 00000000;
                } else if(String.valueOf(t).endsWith("595900")) {
                    t += 414100;
                } else if(String.valueOf(t).endsWith("5900")) {
                    t += 4100;
                } else {
                    t += 100;
                }
                time.add(String.valueOf(t));
            }
        } catch(Exception e) {
            System.out.println("An error occurred during time generation from " + from + " to " + to);
        }
        return time;
    }
}
