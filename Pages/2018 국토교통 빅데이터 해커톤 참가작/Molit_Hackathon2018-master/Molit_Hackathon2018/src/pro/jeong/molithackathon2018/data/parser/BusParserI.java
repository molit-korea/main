package pro.jeong.molithackathon2018.data.parser;

import pro.jeong.molithackathon2018.data.datatype.Bus;
import pro.jeong.molithackathon2018.data.datatype.BusLocation;
import pro.jeong.molithackathon2018.utils.Creators;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;

import static pro.jeong.molithackathon2018.utils.Utilities.parseDate;

public class BusParserI implements Runnable{
    /**
     * Service to provide
     *
     * Load bus data by its trip ID.
     *
     */
    Bus bus = null;
    File index = null;
    File rawFile = null;

    String rawDataLocation = ""; // Distinguish this with rawDataPath.
    int    rowStartingFrom = 0;

    String indexPath = "";
    String rawDataPath = "";
    String tripID = "";

    String year = "";
    String month = "";
    String day = "";

    public BusParserI(String indexPath, String rawDataPath, String tripID, String date) {
        this.indexPath = indexPath;
        this.rawDataPath = rawDataPath;
        this.tripID = tripID;

        String[] dateSplit = parseDate(date);
        year = dateSplit[0];
        month = dateSplit[1];
        day = dateSplit[2];


    }

    public BusParserI() {
        /**
         * C-130225277417080309110000
         * C-186603637317080317390000
         * C2783370517080308130000
         * C-186597025717080310120000
         * C184683059817080305330000
         * C-141667501117080308420000
         * C-21613060517080400000000
         */
        System.out.println("\u001B[31m" + "==================================== TESTING =====================================" + "\u001B[0m");
        indexPath = "F:/TESTSITE/Index/";
        rawDataPath = "J:/BusData/";
        tripID = "C-186603637317080317390000";
        year = "17";
        month = "08";
        day = "03";
    }

    public Bus getBus() {
        if(!index.isFile()) {
            System.out.println("RUN FIRST");
            return bus;
        } else {
            return bus;
        }
    }

    @Override
    public void run() {
        loadIndex();
        readIndex();
        readData();
    }

    private void loadIndex() {
        index = new File(Paths.get(indexPath, "BY_TRIP_ID", year, month+day).toString() + "/Index.csv");
    }

    private void readIndex() {
        String line = "";
        BufferedReader reader = Creators.createBufferedReader(index.getAbsolutePath(), "UTF-8");
        try {
            while ((line = reader.readLine()) != null) {
                if(line.startsWith(tripID)) {
                    String[] split = line.split(",");
                    System.out.println("Found tripID in the index");
                    System.out.println("Trip ID : " + split[0]);
                    System.out.println("Data located at : " + split[1]);
                    System.out.println("Starting from line : " + split[2]);

                    rawDataLocation = split[1];
                    rowStartingFrom = Integer.parseInt(split[2]);
                    break;
                }
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
    }

    private void readData() {
        bus = new Bus(tripID);
        rawFile = new File(rawDataLocation);
        BufferedReader reader = Creators.createBufferedReader(rawFile.getAbsolutePath(), "UTF-8");
        try {
            String line = "";
            int lineCount = 0;
            while((line = reader.readLine()) != null) {
                if(line.startsWith(tripID)) {
                    if(!line.startsWith(tripID)) {
                        System.out.println("BREAK");
                        break;
                    }
                    String split[] = line.split("\\|");

                    if(lineCount == 0) {
                        setStaticBusData(split);
                    }
                    setDynamicBusData(split);
                    setBusLocation(lineCount, split);

                    String dailyDriveLength = split[7];
                    bus.setDayDriveLength(dailyDriveLength);
                    lineCount++;
                }
            }
        } catch(IOException e) {
            e.printStackTrace();
        }
        appendDynamicBusData();
    }

    ArrayList<String> dailyDriveLength = new ArrayList<>(); // 7
    ArrayList<String> accumulatedDriveLength = new ArrayList<>(); // 8
    ArrayList<String> busSpeed = new ArrayList<>(); // 9
    ArrayList<String> rpm = new ArrayList<>(); // 10
    ArrayList<String> locX = new ArrayList<>(); // 12
    ArrayList<String> locY = new ArrayList<>(); // 13
    ArrayList<String> GISAngle = new ArrayList<>(); // 14
    ArrayList<String> runningRegion = new ArrayList<>(); // 18
    ArrayList<String> signalTime = new ArrayList<>(); // 20
    ArrayList<BusLocation> busLocations = new ArrayList<>();

    private void setDynamicBusData(String[] split) {
        busSpeed.add(split[9]);
        rpm.add(split[10]);
    }

    private void setBusLocation(int count, String[] split) {
        BusLocation location = new BusLocation(split[20], split[12], split[13], split[14]);
        busLocations.add(location);
    }

    private void appendDynamicBusData() {
        bus.setBusSpeed(busSpeed);
        bus.setRpm(rpm);
        bus.setLocation(busLocations);
    }

    private void setStaticBusData(String[] split) {
        bus.setRecorederModel(split[1]);
        bus.setBusNumber_01(split[2]);
        bus.setBusType(split[3]);
        bus.setBusID(split[4]);
        bus.setCompanyID(split[5]);
        bus.setDriverID(split[6]);
        bus.setRunningRegion(split[18]);
    }
}
