package pro.jeong.molithackathon2018.data.datatype;

import java.util.ArrayList;
import java.util.HashMap;

public class Bus {
    ArrayList<String> signalGeneratedTime = new ArrayList<String>();

    private String tripID = "";
    private String recorederModel = "DEFAULT_MODEL";
    private String busNumber_01 = ""; // 차대번호?
    private String busType = "";
    private String busID = "";
    private String companyID = "";
    private String driverID = "";
    private String dayDriveLength = "";
    private String accumulatedDriveLength = "";
    private String runningRegion = "";
    private int busLocationSize = 0;

    private ArrayList<String> busSpeed = new ArrayList<>();
    private ArrayList<String> rpm = new ArrayList<>();
    private ArrayList<String> brakeSignal = new ArrayList<>();

    private ArrayList<BusLocation> location = new ArrayList<>();

    public Bus(String tripID) {
        this.tripID = tripID;
    }

    public ArrayList<BusLocation> getBusLocation() {
        return location;
    }

    public String getRunningRegion() {
        return runningRegion;
    }

    public String getBusX(int seq) {
        return location.get(seq).getX();
    }

    public String getBusY(int seq) {
        return location.get(seq).getY();
    }

    public String getBusAngle(int seq) {
        return location.get(seq).getAngle();
    }

    public ArrayList<String> getSignalGeneratedTime() {
        return signalGeneratedTime;
    }

    public String getTripID() {
        return tripID;
    }

    public String getRecorederModel() {
        return recorederModel;
    }

    public String getBusNumber_01() {
        return busNumber_01;
    }

    public String getBusType() {
        return busType;
    }

    public String getBusID() {
        return busID;
    }

    public String getCompanyID() {
        return companyID;
    }

    public String getDriverID() {
        return driverID;
    }

    public String getDayDriveLength() {
        return dayDriveLength;
    }

    public String getAccumulatedDriveLength() {
        return accumulatedDriveLength;
    }

    public ArrayList<String> getBusSpeed() {
        return busSpeed;
    }

    public ArrayList<String> getRpm() {
        return rpm;
    }

    public ArrayList<String> getBrakeSignal() {
        return brakeSignal;
    }

    public ArrayList<BusLocation> getLocation() {
        return location;
    }

    public void setSignalGeneratedTime(ArrayList<String> signalGeneratedTime) {
        this.signalGeneratedTime = signalGeneratedTime;
    }

    public void setTripID(String tripID) {
        this.tripID = tripID;
    }

    public void setRecorederModel(String recorederModel) {
        this.recorederModel = recorederModel;
    }

    public void setBusNumber_01(String busNumber_01) {
        this.busNumber_01 = busNumber_01;
    }

    public void setBusType(String busType) {
        this.busType = busType;
    }

    public void setBusID(String busID) {
        this.busID = busID;
    }

    public void setCompanyID(String companyID) {
        this.companyID = companyID;
    }

    public void setDriverID(String driverID) {
        this.driverID = driverID;
    }

    public void setDayDriveLength(String dayDriveLength) {
        this.dayDriveLength = dayDriveLength;
    }

    public void setAccumulatedDriveLength(String accumulatedDriveLength) {
        this.accumulatedDriveLength = accumulatedDriveLength;
    }

    public void setBusSpeed(ArrayList<String> busSpeed) {
        this.busSpeed = busSpeed;
    }

    public void setRpm(ArrayList<String> rpm) {
        this.rpm = rpm;
    }

    public void setBrakeSignal(ArrayList<String> brakeSignal) {
        this.brakeSignal = brakeSignal;
    }

    public void setLocation(ArrayList<BusLocation> location) {
        this.location = location;
    }

    public void setRunningRegion(String runningRegion) {
        this.runningRegion = runningRegion;
    }
}
