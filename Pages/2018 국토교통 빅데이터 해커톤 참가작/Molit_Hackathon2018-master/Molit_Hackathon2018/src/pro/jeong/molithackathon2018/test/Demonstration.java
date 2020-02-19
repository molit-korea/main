package pro.jeong.molithackathon2018.test;

import pro.jeong.molithackathon2018.core.tripVisualizer.Visualizer;
import pro.jeong.molithackathon2018.data.datatype.Bus;
import pro.jeong.molithackathon2018.data.parser.BusParserI;
import pro.jeong.molithackathon2018.data.parser.TripIDRetriever;

import java.util.ArrayList;

public class Demonstration {
    public static void main(String[] ar) {
        TripIDRetriever retriever = new TripIDRetriever("F:/TESTSITE/Index/", "2017-08-02");
        ArrayList<String> trips = retriever.getTripIDs();

        String id = trips.get(50001);

        BusParserI parser = new BusParserI("F:/TESTSITE/Index/", "J:/BusData/", id, "2017-08-02");
        Thread parserThread = new Thread(parser);
        parserThread.start();

        try {
            parserThread.join();
        } catch(InterruptedException e) {
            e.printStackTrace();
        }

        Bus bus = parser.getBus();

        System.out.println("Bus ID : " + bus.getBusID());
        System.out.println("Bus Type : " + bus.getBusType());
        System.out.println("Company ID : " + bus.getCompanyID());
        System.out.println("Region ID : " + bus.getRunningRegion());
        System.out.println("Bus Number_01 : " + bus.getBusNumber_01());
        System.out.println("Driver ID : " + bus.getDriverID());
        System.out.println("Recorder Model : " + bus.getRecorederModel());
        System.out.println("Daily Drive Length : " + bus.getDayDriveLength());

        for(int i = 0; i < bus.getBusLocation().size(); i++) {
            System.out.println(bus.getBusY(i).substring(0, 3) + "." + bus.getBusY(i).substring(3) + ", " + bus.getBusX(i).substring(0, 3) + "." +
            bus.getBusX(i).substring(3));
        }
        Visualizer v = new Visualizer(bus);
        v.visualizeBus();
    }
}
