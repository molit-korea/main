package pro.jeong.molithackathon2018.data.parser;

import pro.jeong.molithackathon2018.utils.Creators;
import pro.jeong.molithackathon2018.utils.Utilities;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;

public class TripIDRetriever {
    String year = "";
    String month = "";
    String day = "";
    File indexFile = null;

    public TripIDRetriever(String indexPath, String date) {
        String[] dateSplit = Utilities.parseDate(date);
        year = dateSplit[0];
        month = dateSplit[1];
        day = dateSplit[2];

        try {
            indexFile = new File(Paths.get(indexPath, "BY_TRIP_ID", year, month+day, "Index.csv").toString());
        } catch(Exception e) {
            e.printStackTrace();
        }
    }

    public ArrayList<String> getTripIDs() {
        ArrayList<String> retArr = new ArrayList<>();
        BufferedReader reader = Creators.createBufferedReader(indexFile.getAbsolutePath(), "UTF-8");
        String line = "";

        try {
            while ((line = reader.readLine()) != null) {
                String[] split = line.split(",");
                retArr.add(split[0]);
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
        return retArr;
    }
}
