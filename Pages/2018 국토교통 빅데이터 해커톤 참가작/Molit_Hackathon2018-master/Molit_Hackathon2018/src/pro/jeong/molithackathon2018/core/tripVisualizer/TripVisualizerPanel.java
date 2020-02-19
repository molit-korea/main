package pro.jeong.molithackathon2018.core.tripVisualizer;

import pro.jeong.molithackathon2018.data.datatype.Bus;
import pro.jeong.molithackathon2018.data.datatype.BusLocation;
import pro.jeong.molithackathon2018.utils.Utilities;

import javax.swing.*;
import java.awt.*;
import java.util.ArrayList;

public class TripVisualizerPanel extends JPanel {
    Bus bus = null;
    ArrayList<BusLocation> busLocations = new ArrayList<BusLocation>();

    ArrayList<Integer> xCoordinates = new ArrayList<>();
    ArrayList<Integer> yCoordinates = new ArrayList<>();

    ArrayList<Integer> xCalibrated = new ArrayList<>();
    ArrayList<Integer> yCalibrated = new ArrayList<>();

    int xMean = 0;
    int yMean = 0;

    int xThreshold = 0;
    int yThreshold = 0;

    int xMin = 0;
    int xMax = 0;
    int yMin = 0;
    int yMax = 0;

    int xMinMaxDiff = 0;
    int yMinMaxDiff = 0;

    TripVisualizerPanel(Bus bus) {
        System.out.println("Trip Visualizer Panel Contructor Called");
        this.bus = bus;
        busLocations = bus.getBusLocation();

        findMean();
        setCoordinates();
        findMaxMinCoordinates();
        calculatedXYDiff();
        calibrateCoordinates();

        System.out.println("BusLocation Data Size : " + bus.getLocation().size());
        System.out.println("xCoordinate Size : " + xCoordinates.size() + "   yCoordinates Size : " + yCoordinates.size());
        System.out.println("X - Mean : " + xMean + "    Y - Mean : " + yMean);
        System.out.println("X - Threshold : " + xThreshold + "    Y - Threshold : " + yThreshold);
        System.out.println("Xmin, xMax : " + xMin + "   " + xMax);
        System.out.println("Ymin, yMax : " + yMin + "   " + yMax);
        System.out.println("X diff : " + xMinMaxDiff + "   Y diff : " + yMinMaxDiff);

        setSize(new Dimension(10000, 10000));
    }

    private void setCoordinates() {
        for(int i = 0; i < busLocations.size(); i++) {
            int x = Integer.parseInt(bus.getBusX(i));
            int y = Integer.parseInt(bus.getBusY(i));
            if(x != 0 && y != 0 && x > xThreshold && y > yThreshold) {
                xCoordinates.add(Integer.parseInt(bus.getBusX(i).substring(3)));
                yCoordinates.add(Integer.parseInt(bus.getBusY(i).substring(3)));
            }
        }
    }

    private void findMean() {
        double xTotal = 0;
        double yTotal = 0;
        int validCount = 0;
        for(int i = 0; i < busLocations.size(); i++) {
            int x = Integer.parseInt(busLocations.get(i).getX());
            int y = Integer.parseInt(busLocations.get(i).getY());
            if(x != 0 && y != 0) {
                validCount++;
                xTotal += x;
                yTotal += y;
            }
        }
        xMean = Math.round(Float.parseFloat(String.valueOf(xTotal / validCount)));
        yMean = Math.round(Float.parseFloat(String.valueOf(yTotal / validCount)));

        xThreshold = Math.round(Float.parseFloat(String.valueOf(xMean * 0.99)));
        yThreshold = Math.round(Float.parseFloat(String.valueOf(yMean * 0.99)));
    }

    private void findMaxMinCoordinates() {
        xMin = Utilities.findMinimum(xCoordinates);
        xMax = Utilities.findMaximum(xCoordinates);

        yMin = Utilities.findMinimum(yCoordinates);
        yMax = Utilities.findMaximum(yCoordinates);
    }

    private void calculatedXYDiff() {
        xMinMaxDiff = xMax - xMin;
        yMinMaxDiff = yMax - yMin;
    }

    private void calibrateCoordinates() {
        int toDeduceFromX = xMin;
        int toDeduceFromY = yMin;
        for(int i = 0; i < xCoordinates.size(); i++) {
            xCalibrated.add(xCoordinates.get(i) - toDeduceFromX);
            yCalibrated.add(yCoordinates.get(i) - toDeduceFromY);
        }
    }

    private void removeSpikingData() {
        for(int i = 0; i < busLocations.size(); i++) {

        }
    }

    public void paint(Graphics g1) {
        super.paintComponent(g1);
        Graphics2D g = (Graphics2D)g1;
        g.setColor(Color.BLACK);
        for(int i = 0; i < xCalibrated.size(); i++) {
            int x = Math.round(Float.parseFloat(String.valueOf(xCalibrated.get(i) / (xMinMaxDiff * 0.0001))));
            int y = Math.round(Float.parseFloat(String.valueOf(yCalibrated.get(i) / (yMinMaxDiff * 0.0001))));
            g.fillOval(x, y, 50, 50);
        }
    }
}
