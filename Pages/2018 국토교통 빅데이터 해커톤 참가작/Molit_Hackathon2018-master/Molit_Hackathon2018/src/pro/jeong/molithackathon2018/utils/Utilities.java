package pro.jeong.molithackathon2018.utils;

import java.io.File;
import java.util.ArrayList;

public class Utilities {
    private static ArrayList<String> endPointPaths = new ArrayList<>();

    public static ArrayList<String> listEndPointDirectories(String rootDir) {
        if(!new File(rootDir).isDirectory()) {
            String discoveredFilePath = rootDir;
            endPointPaths.add(discoveredFilePath);
        } else if(new File(rootDir).isDirectory()) {
            String[] pathList = new File(rootDir).list();
            for(String f : pathList) {
                String togo = rootDir + "/" + f;
                listEndPointDirectories(togo);
            }
        }
        return endPointPaths;
    }

    public static String[] parseDate(String rawDate) {
        String[] split = rawDate.split("-");
        if(split[0].length() == 4) {
            split[0] = split[0].substring(2);
        }
        return split;
    }

    public static int findMinimum(ArrayList<Integer> list) {
        int min = 0;
        min = list.get(0);
        for(int i = 0; i < list.size(); i++) {
            if(list.get(i) < min) {
                min = list.get(i);
            }
        }
        return  min;
    }

    public static int findMaximum(ArrayList<Integer> list) {
        int max = 0;
        max = list.get(0);
        for(int i = 0; i < list.size(); i++) {
            if(list.get(i) > max) {
                max = list.get(i);
            }
        }
        return  max;
    }

    private int findMinimum(ArrayList<String> list, int k) {
        int min = 0;
        min = Integer.parseInt(list.get(0));
        for(int i = 0; i < list.size(); i++) {
            int tmp = Integer.parseInt(list.get(i));
            if(tmp < min) {
                min = tmp;
            }
        }
        return  min;
    }

    private int findMaximum(ArrayList<String> list, int k) {
        int max = 0;
        max = Integer.parseInt(list.get(0));
        for(int i = 0; i < list.size(); i++) {
            int tmp = Integer.parseInt(list.get(i));
            if(tmp > max) {
                max = tmp;
            }
        }
        return  max;
    }
}
