package pro.jeong.molithackathon2018.utils;

import java.io.*;

public class Creators {
    public static BufferedReader createBufferedReader(String filePath, String charset) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new InputStreamReader(new FileInputStream(new File(filePath))));
            return reader;
        } catch(IOException e) {
            e.printStackTrace();
            return null;
        }
    }
}
